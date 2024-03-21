import { Request, Response, NextFunction } from 'express';

import { BlogModel } from '../models/Blog';

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BlogModel.find();
    if (!result) {
      res.status(404).json({
        message: 'Unable to find blogs',
      });
    } else {
      res.status(200).send(result);
    }
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
    const result = await BlogModel.findById(id);

    if (!result) {
      res.status(404).json({
        message: "Resource does not exist anymore"
      });
    } else {
      res.status(200).send(result);
    }
  } catch (error: any) {
    next(error);
  }
};

export const searchPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.query.search;

  try {
    const result = await BlogModel.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ],
    });
    if (result.length <= 0) {
      res.status(404).json({
        message: "nothing found"
      });
    } else {
      res.status(200).send(result);
    }
  } catch (error: any) {
    next(error);
  }
};
