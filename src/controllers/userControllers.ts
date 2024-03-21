import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { comparePassword, genSalt, hashPassword } from '../utils/password';

import { User, UserModel } from '../models/User';
import mongoose from 'mongoose';
import { BlogModel } from '../models/Blog';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDTO = { ...req.body };

  const { username, name, password } = userDTO;

  try {
    // Check if username already exists in database
    const userCheck = await UserModel.findOne({ username });

    // if username exists send back response to client
    if (userCheck) {
      res.send('username already in use');
    } else {
      // if username does not exist in database generate hash salt and create password hash
      const salt: string = await genSalt();
      const hash: string = await hashPassword(password, salt);

      const newUser = await UserModel.create({
        username,
        name,
        password: hash,
        salt,
      });

      res.status(201).send('Registration successfull');
    }
  } catch (error: any) {
    next(error);
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDTO = { ...req.body };
  const { username, password } = userDTO;
  const jwtSecret = process.env.JWT_SECRET!;

  try {
    const user = await UserModel.findOne({ username });

    // Check that query did not return a null value
    if (user !== null) {
      // check password validity
      const isPassword = await comparePassword(
        password,
        user.password,
        user.salt
      );

      // if Password is not valid send a response to the client
      if (!isPassword) {
        res.send('invalid username or password');
      }

      // if password is valid create jwt token
      const token = jwt.sign(
        { uID: user._id, username: user.username },
        jwtSecret
      );

      // token  to a cookie and send response to client
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send(`Login successfull, ${user.username}`);
    } else {
      res.send('Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};

export const getUSer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const id = req.params.id;
  try {
    const user = UserModel.findById(id);
  } catch (error) {
    next(error);
  }
};

export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogDTO = { ...req.body };
  const { title, snippet, body } = blogDTO;
  const author: string = req.user.userId;

  try {
    const newBlog = await BlogModel.create({ title, snippet, body, author });

    res.status(200).send('Post added');
  } catch (error) {
    next(error);
  }
};

export const editPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const content = req.body;

  const id = req.params.id;

  try {
    const post = await BlogModel.findById(id);

    if (post === null) {
      res.send('unable to find post');
    } else if (!post.author.equals(req.user.userId)) {
      res.send('Unauthorized operation');
    } else {
      await BlogModel.findByIdAndUpdate(id, content, { new: true });

      res.status(200).send('Post updated successfully');
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const postId = new mongoose.Types.ObjectId(id);

  try {
    const post = await BlogModel.findById(id);

    if (post === null) {
      res.send('unable to complete operation');
    } else if (!post.author.equals(req.user.userId)) {
      res.send('Unauthorized operation');
    } else {
      const deleted = await BlogModel.findByIdAndDelete(id);
      if (deleted !== null) {
        const user = await UserModel.findById(deleted.author);

        if (user) {
          // Remove the post ID from the user's posts array
          const postIndex = user.posts.indexOf(postId);
          if (postIndex !== -1) {
            user.posts.splice(postIndex, 1);
            await user.save(); // Save the updated user document
          }
        }

        res.status(200).send('Post successfully deleted');
      }
    }
  } catch (error) {
    next(error);
  }
};

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  res.status(200).send('Log out successfull');
};
