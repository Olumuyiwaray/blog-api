import { NotFoundError } from '../utils/customErrors';
import { Blog, IBlog } from '../models/blog';
import { Comment } from '../models/comment';
import { getCache, setCache } from '../config/cache';

const getAllBlogs = async () => {
  console.log('in the blog service');
  const cacheKey = 'blogs:all';

  const cacheBlogs = await getCache(cacheKey);
  console.log('here 1');
  if (cacheBlogs) {
    return cacheBlogs;
  }
  console.log('here 2');
  const blogs = await Blog.find();
  if (blogs.length <= 0) {
    throw new NotFoundError('No posts found');
  }
  console.log('here 3');
  await setCache(cacheKey, blogs, 3600);
  console.log('here 4');
  return blogs;
};

const getBlogById = async (blogId: string) => {
  const result = await Blog.findById(blogId);

  if (!result) {
    throw new NotFoundError('Unable to find post');
  }
  return result;
};

const searchBlogs = async (search: any) => {
  const result = await Blog.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { body: { $regex: search, $options: 'i' } },
    ],
  });
  if (result.length <= 0) {
    throw new NotFoundError('Nothing found');
  }
  return result;
};

const createBlog = async (payload: any, userId: string) => {
  const { title, snippet, body, image } = payload;

  const newPost = await Blog.create({
    title,
    snippet,
    body,
    image,
    author: userId,
  });

  if (!newPost) {
    throw new Error('Unable to create blog try again later');
  }

  return 'blog created';
};

const editBlog = async (content: Partial<IBlog>, blogId: string) => {
  const updatedPosts = await Blog.findByIdAndUpdate(blogId, content, {
    new: true,
  });

  if (!updatedPosts) {
    throw new Error('Unable to update blog try again later');
  }

  return 'blog edited successfully';
};

// const toggleBlogLike = async (blogId: string, userId: any) => {
//   const blog = await Blog.findById(blogId);

//   if (!blog) {
//     throw new NotFoundError('blog not found');
//   }

//   const userIndex = blog.likes.indexOf(userId);

//   /**
//    * if the post is already liked remove the like, else like post
//    */

//   if (userIndex === -1) {
//     blog.likes.push(userId);
//   } else {
//     blog.likes.splice(userIndex, 1);
//   }
//   await blog.save();

//   return 'Blog liked';
// };

const getComments = async (blogId: string) => {
  const blog = await Blog.findById(blogId).populate({
    path: 'comments',
    populate: { path: 'user', select: 'username' },
  });

  if (!blog) {
    throw new NotFoundError('blog not found');
  }

  return blog.comments;
};

const addComment = async (blogId: string, userId: any, content: any) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new NotFoundError('blog not found');
  }

  const comment = await Comment.create({ user: userId, post: blogId, content });

  blog.comments.push(comment._id);

  await blog.save();
  return 'comment added sucessfully';
};

const editComment = async (commentId: string, content: any) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content: { $eq: content } },
    {
      new: true,
    }
  );

  if (!updatedComment) {
    throw new Error('Unable to edit comment try again later');
  }

  return 'comment edited successfully';
};

const deleteComment = async (commentId: string) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new NotFoundError('comment not found');
  }

  await comment.deleteOne();

  await Blog.updateOne(
    { comments: commentId },
    { $pull: { comments: commentId } }
  );
  return 'Comment succesfully removed';
};

const deleteBlog = async (blogId: string) => {
  const toBeDeleted = await Blog.findById(blogId);

  if (!toBeDeleted) {
    throw new NotFoundError('post not found');
  }

  await toBeDeleted.deleteOne();

  return 'Post succesfully removed';
};

export default {
  getAllBlogs,
  getBlogById,
  searchBlogs,
  createBlog,
  editBlog,
  // toggleBlogLike,
  getComments,
  addComment,
  editComment,
  deleteComment,
  deleteBlog,
};
