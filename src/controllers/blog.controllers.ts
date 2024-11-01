import { Request, Response, NextFunction } from 'express';

import services from '../services/blogs.service';
import { IBlog } from '../models/blog';

/**
 * GET /blogs
 * Get all blogs
 *
 * Returns all blogs
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @return {Promise<void>} - The promise
 */
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
  /**
   * GET /blogs/:blogId
   * Get a single blog by id
   *
   * Returns a single blog
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next function
   * @return {Promise<void>} - The promise
   */
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

/**
 * GET /blogs/search
 * Search for a blog by title or body
 *
 * Returns all matching blogs
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 * @return {Promise<void>} - The promise
 */
const searchBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const search = req.query.search;

  try {
    const result = await services.searchBlogs(search);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

/**
 * POST /blogs
 * Create a new blog
 *
 * Creates a new blog post with the provided details in the request body.
 * If an image is uploaded, its location will be included in the blog data.
 *
 * @param {Request} req - The request object containing blog details and user information
 * @param {Response} res - The response object to send the result of the creation process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the blog creation
 */
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

/**
 * PUT /blogs/:blogId
 * Edit an existing blog post
 *
 * Updates an existing blog post with the provided details in the request body.
 *
 * @param {Request} req - The request object containing the blog details to be updated
 * @param {Response} res - The response object to send the result of the update process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the blog update
 */
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

/**
 * GET /blogs/:blogId/comments
 * Get all comments of a blog post
 *
 * Returns all comments of the given blog post
 * @param {Request} req - The request object containing the blog id
 * @param {Response} res - The response object to send the result of the query process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the query
 */
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

/**
 * POST /blogs/:blogId/comments
 * Add a comment to a blog post
 *
 * Adds a comment to the given blog post
 * @param {Request} req - The request object containing the blog id and user information
 * @param {Response} res - The response object to send the result of the creation process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the creation process
 */
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

/**
 * PATCH /blogs/:blogId/comments/:commentId
 * Edit an existing comment on a blog post
 *
 * Updates an existing comment on a blog post with the given id
 * @param {Request} req - The request object containing the comment id and updated comment content
 * @param {Response} res - The response object to send the result of the update process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the comment update
 */
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

/**
 * DELETE /blogs/:blogId/comments/:commentId
 * Delete a comment on a blog post
 *
 * Deletes an existing comment on a blog post with the given id
 * @param {Request} req - The request object containing the comment id
 * @param {Response} res - The response object to send the result of the deletion process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the deletion process
 */
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

/**
 * DELETE /blogs/:blogId
 * Delete an existing blog post
 *
 * Deletes an existing blog post with the given blog id.
 *
 * @param {Request} req - The request object containing the blog id to be deleted
 * @param {Response} res - The response object to send the result of the deletion process
 * @param {NextFunction} next - The next middleware function in the stack
 * @return {Promise<void>} - The promise indicating the completion of the deletion process
 */
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
