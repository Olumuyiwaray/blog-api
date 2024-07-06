import { Request, Response, NextFunction } from 'express';

import {
  addBlogComment,
  createPost,
  deleteBlogComment,
  editBlogComment,
  getAllBlogs,
  getBlogComments,
  getBlogSearch,
  getSingleBlog,
  removePost,
  toggleBlogLike,
  updatePost,
} from '../services/blogs.service';
import { IBlog } from '../models/Blog';

export const getBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllBlogs();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId } = req.params;
  try {
    const result = await getSingleBlog(blogId);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const searchBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.query.search;

  try {
    const result = await getBlogSearch(search);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogDTO: IBlog = { ...req.body };
  if (req.file) {
    blogDTO.image = req.file.location;
  }

  const { userId } = req.user;

  try {
    const message = await createPost(blogDTO, userId);
    res.status(201).json({ message });
  } catch (error: any) {
    next(error);
  }
};

export const editBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const content = req.body;

  const { blogId } = req.params;

  try {
    const message = await updatePost(content, blogId);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;

  const { blogId } = req.params;

  try {
    const result = await toggleBlogLike(blogId, userId);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId } = req.params;
  try {
    const result = await getBlogComments(blogId);
    res.status(200).json({ result });
  } catch (error: any) {
    next(error);
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const { content } = req.body;

  try {
    const message = await addBlogComment(blogId, userId, content);
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const message = await editBlogComment(commentId, content);
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  try {
    const message = await deleteBlogComment(commentId);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { blogId } = req.params;

  try {
    const message = await removePost(blogId);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
