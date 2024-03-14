import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


import { genSalt, hashPassword } from '../utils/password';
import { createPost, createUser, deleteBlogPost, editBlogPost, loginUser } from '../services/user.service';


export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, password } = req.body;

    try {
        
        // generate hash salt and create password hash
        const salt = await genSalt();
        const hash = await hashPassword(password, salt);
        
        await createUser(username, name, hash, salt);

        res.send("Registration successfull");
    
   } catch (error: any) {
        res.json({
            message: error.message
       })
    }

}


export const logIn = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET!;

    try {
        const user = await loginUser(username, password);

        const token = jwt.sign({ uID: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.send(`Login successfull, ${user}`);

    } catch (error: any) {
        res.json({
            message: error.message
       }) 
    }
}

export const addPost = async (req: Request, res: Response, next: NextFunction) => {
    const { title, snippet, body } = req.body;
    const author: string = 'example';

    try {

        await createPost(title, snippet, body, author);

        res.send("Post added");

    } catch (error: any) {
        res.json({
            message: error.message
       }) 
    }
}

export const editPost = async (req: Request, res: Response, next: NextFunction) => {
    const content = req.body;

    const id = req.params.id;

    try {
        await editBlogPost(id, content);

        res.send("Post updated successfully");

    } catch (error: any) {
        res.json({
            message: error.message
       })
    }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        await deleteBlogPost(id);
        res.send("Post successfully deleted")
    } catch (error: any) {
        res.json({
            message: error.message
       })
    }

}

export const logOut = (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('token');
    res.send("Log out successfull");
}