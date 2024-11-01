import { Schema } from 'mongoose';
import { BlogtDTO, UserDTO } from '../interfaces/interface';
import { IUser, User } from '../models/user';
import { Blog, IBlog } from '../models/blog';

export const userToDTO = async (user: IUser): Promise<UserDTO> => {
  const postDocs = await Blog.find({ _id: { $in: user.posts } }).lean();
  const posts = await Promise.all(postDocs.map((doc) => postToDTO(doc)));
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profile_image: user.profile_image,
    isVerified: user.isVerified,
    posts: posts,
  };
};

export const postToDTO = async (blog: IBlog): Promise<BlogtDTO> => {
  const authorDoc = await User.findById(blog.author);

  
  const author = await userToDTO(authorDoc);
  return {
    title: blog.title,
    snippet: blog.snippet,
    body: blog.body,
    image: blog.image,
    likes: [],
    comments: [],
    author: author,
  };
};
