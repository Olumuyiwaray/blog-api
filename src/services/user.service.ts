import { Blog, BlogModel } from '../models/Blog';
import { User, UserModel } from '../models/User';
import { DuplicateError } from '../utils/CustomError';
import { comparePassword } from '../utils/password';

export const createUser = async (
  username: string,
  name: string,
  password: string,
  salt: string
): Promise<User> => {
  try {
    // check if user already exists in database
    const userCheck = await UserModel.findOne({ username });

    if (userCheck) {
      throw new DuplicateError('User already exists');
    }

    const user = await UserModel.create({ username, name, password, salt });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<User> => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error('Incorrect username or password');
    }

    // check password compatibility
    const isPassword = await comparePassword(
      password,
      user.password,
      user.salt
    );

    if (!isPassword) {
      throw new Error('Incorrect username or password');
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createPost = async (
  title: string,
  snippet: string,
  body: string,
  author: string
): Promise<Blog> => {
  try {
    const blog = await BlogModel.create({ title, snippet, body, author });

    return blog;
  } catch (error) {
    throw new Error('Unable to create posts please try again later');
  }
};

export const editBlogPost = async (id: string, content: any): Promise<Blog> => {
  try {
    const blog = await BlogModel.findByIdAndUpdate(id, content, { new: true });

    return blog!;
  } catch (error) {
    throw new Error('Unable to edit post please try again later');
  }
};

export const deleteBlogPost = async (id: string): Promise<Blog> => {
  try {
    const blog = await BlogModel.findByIdAndDelete(id);
    return blog!;
  } catch (error) {
    throw new Error('Unable to delete post please try again later');
  }
};
