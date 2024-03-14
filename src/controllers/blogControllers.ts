import { Request, Response, NextFunction } from 'express';
import { getAllBlogs, getBlogSearch, getSingleBlog } from '../services/blog.service';


export const getPosts = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const blogs = await getAllBlogs();

        res.send(blogs);

    } catch (error: any) {
        res.json({
            message: error.message
       })
    }
}


export const getPost = async (req: Request, res: Response, next: NextFunction) => {

    const id = req.params.id;
    try {
        const blog = await getSingleBlog(id);
        res.send(blog);
    } catch (error: any) {
        res.json({
            message: error.message
       }) 
    }
}


export const searchPosts = async (req: Request, res: Response, next: NextFunction) => {

    const searchTerm = req.query.search;

    try {
        const searchResults = getBlogSearch(searchTerm);
        res.send(searchResults);
    } catch (error: any) {
        res.json({
            message: error.message
       })
    }
}