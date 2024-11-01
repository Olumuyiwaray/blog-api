import { Request, Response, NextFunction } from 'express';

import services from '../services/blogs.service';
import { IBlog } from '../models/blog';

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await services.getAllBlogs();

    const responseObj = {
      isSuccess: true,
      message: 'All Blog!',
      data: result,
    };
    res.status(200).json(responseObj);
  } catch (error: any) {
    next(error);
  }
};

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const result = await services.getBlogById(blogId);

    const responseObj = {
      isSuccess: true,
      message: 'Blog Found!',
      data: result,
    };

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const searchBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const search = req.query.search;

  try {
    const result = await services.searchBlogs(search);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  const blogDTO: IBlog = { ...req.body };
  if (req.file) {
    blogDTO.image = req.file.location;
  }

  const { userId } = req.user;

  try {
    const result = await services.createBlog(blogDTO, userId);

    const responseObj = {
      isSuccess: true,
      message: result,
    };
    res.status(201).json(responseObj);
  } catch (error: any) {
    next(error);
  }
};

const editBlog = async (req: Request, res: Response, next: NextFunction) => {
  const content = req.body;

  const { blogId } = req.params;

  try {
    const result = await services.editBlog(content, blogId);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

// const toggleBlogLike = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { userId } = req.user;

//   const { blogId } = req.params;

//   try {
//     const result = await services.toggleBlogLike(blogId, userId);

//     const responseObj = {
//       isSuccess: true,
//       message: result,
//     };

//     res.status(200).json({ result });
//   } catch (error) {
//     next(error);
//   }
// };

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const result = await services.getComments(blogId);

    const responseObj = {
      isSuccess: true,
      message: 'Blog Comments!',
      data: result,
    };

    res.status(200).json(responseObj);
  } catch (error: any) {
    next(error);
  }
};

const addComment = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const { userId } = req.user;
  const { content } = req.body;

  try {
    const result = await services.addComment(blogId, userId, content);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(201).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const editComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const result = await services.editComment(commentId, content);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(201).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { commentId } = req.params;

  try {
    const result = await services.deleteComment(commentId);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;

  try {
    const result = await services.deleteBlog(blogId);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllBlogs,
  getBlogById,
  searchBlogs,
  // toggleBlogLike,
  createBlog,
  editBlog,
  getComments,
  addComment,
  editComment,
  deleteComment,
  deleteBlog,
};
