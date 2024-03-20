import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { genSalt, hashPassword } from '../utils/password';
import {
  createPost,
  createUser,
  deleteBlogPost,
  editBlogPost,
  loginUser,
} from '../services/user.service';
import { getSingleBlog } from '../services/blog.service';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, name, password } = req.body;

  try {
    // generate hash salt and create password hash
    const salt = await genSalt();
    const hash = await hashPassword(password, salt);

    await createUser(username, name, hash, salt);

    res.status(200).send('Registration successfull');
  } catch (error: any) {
    res.json({
      message: error.message,
    });
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET!;

  try {
    const user = await loginUser(username, password);

    const token = jwt.sign(
      { uID: user._id, username: user.username },
      jwtSecret
    );
    res.cookie('token', token, { httpOnly: true });
    res.status(200).send(`Login successfull, ${user}`);
  } catch (error: any) {
    res.json({
      message: error.message,
    });
  }
};

export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, snippet, body } = req.body;
  const author: string = req.user.userId;

  try {
    await createPost(title, snippet, body, author);

    res.status(200).send('Post added');
  } catch (error: any) {
    res.json({
      message: error.message,
    });
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
    const post = await getSingleBlog(id);

    if (!post.author.equals(req.user.userId)) {
      res.send('Unauthorized operation');
    } else {
      await editBlogPost(id, content);

      res.status(200).send('Post updated successfully');
    }
  } catch (error: any) {
    res.json({
      message: error.message,
    });
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
    const post = await getSingleBlog(id);

    if (!post.author.equals(req.user.userId)) {
      res.send('Unauthorized operation');
    } else {
      const deleted = await deleteBlogPost(id);

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
  } catch (error: any) {
    res.json({
      message: error.message,
    });
  }
};

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  res.status(200).send('Log out successfull');
};
