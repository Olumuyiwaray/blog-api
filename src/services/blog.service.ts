import { Error } from 'mongoose';
import { BlogModel, Blog } from '../models/Blog';
import { DatabaseError, NotFoundError } from '../utils/CustomError';

export const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const result = await BlogModel.find();
    return result;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getSingleBlog = async (id: string): Promise<Blog> => {
  try {
    const result = await BlogModel.findById(id);

    if (!result) {
      throw new NotFoundError('Document does not exist anymore');
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getBlogSearch = async (search: any): Promise<Blog[]> => {
  try {
    const result = await BlogModel.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
      ],
    });
    if (!result) {
      throw new NotFoundError('Nothing Found');
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
