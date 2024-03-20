import { Request, Response, NextFunction } from 'express';
import {
  getAllBlogs,
  getBlogSearch,
  getSingleBlog,
} from '../services/blog.service';

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await getAllBlogs();

    res.status(200).send(blogs);
  } catch (error: any) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const blog = await getSingleBlog(id);
    res.status(200).send(blog);
  } catch (error: any) {
    next(error);
  }
};

export const searchPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchTerm = req.query.search;

  try {
    const searchResults = getBlogSearch(searchTerm);
    res.status(200).send(searchResults);
  } catch (error: any) {
    next(error);
  }
};
