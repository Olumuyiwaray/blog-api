import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/blog';

/**
 * 
 Check if the post being modified or deleted is being done so by the owner
 */

export const checkPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.blogId;
    const authorId = req.user.userId;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'blog not found' });
    }

    if (String(blog.author) !== authorId) {
      return res.status(401).json({ message: 'Unauthorized operation' });
    }
    next();
  } catch (error) {
    next(error);
  }
};
