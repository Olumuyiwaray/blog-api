import { getCache, setCache } from '../../../config/cache';
import { NotFoundError } from '../../../lib/customErrors';
import { Blog, Comment } from '../../../models/Blog';
import * as blogService from '../../../services/blogs.service';
import RedisMock from 'ioredis-mock';
// import { Redis, redis } from '../../../config/queue';

jest.mock('../../../config/cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
}));

describe('Get all blogs service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  /**
 * 
 * 
afterAll(async () => {
    await redis.quit();
  });

  Redis has been keeping 
  juest from exiting properly, 
  still working on it.

  
  Been forcefully stopping jest with --forceExit
 */

  describe('Get all blogs service', () => {
    it('Should return all blogs', async () => {
      const mockResult = [
        {
          title: 'new blog',
          snippet: 'a new snippet',
          body: 'a new body',
          image: '.jpg',
          likes: [],
          comment: [],
          author: 'userId',
        },
      ];
      Blog.find = jest.fn().mockResolvedValue(mockResult);

      (getCache as jest.Mock).mockResolvedValue(null);

      const result = await blogService.getAllBlogs();

      expect(Blog.find).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual(mockResult);
    });

    it('Should throw an error if no blog is found', async () => {
      Blog.find = jest.fn().mockResolvedValue([]);

      await expect(blogService.getAllBlogs()).rejects.toThrow(NotFoundError);
      await expect(blogService.getAllBlogs()).rejects.toThrow('No posts found');
      expect(Blog.find).toHaveBeenCalled();
    });
  });

  describe('Get single blog service', () => {
    it('should return a single blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'userId',
      };

      Blog.findById = jest.fn().mockResolvedValue(mockResult);

      const blogId = 'validId';

      const result = await blogService.getSingleBlog(blogId);

      expect(Blog.findById).toHaveBeenCalledWith(blogId);
      expect(result).toEqual(mockResult);
    });

    it('Should throw an error if blog is not found', async () => {
      Blog.findById = jest.fn().mockResolvedValue(null);

      const blogId = 'inValidId';

      await expect(blogService.getSingleBlog(blogId)).rejects.toThrow(
        NotFoundError
      );
      await expect(blogService.getSingleBlog(blogId)).rejects.toThrow(
        'Unable to find post'
      );
      expect(Blog.findById).toHaveBeenCalledWith(blogId);
    });
  });

  describe('blog search service', () => {
    it('should return search results', async () => {
      const mockResult = [
        {
          _id: 'validId',
          title: 'new blog',
          snippet: 'a new snippet',
          body: 'a new body',
          image: '.jpg',
          likes: [],
          comment: [],
          author: 'userId',
        },
      ];

      Blog.find = jest.fn().mockResolvedValue(mockResult);

      const searchTerm = 'new blog';

      const result = await blogService.getBlogSearch(searchTerm);

      expect(Blog.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { body: { $regex: searchTerm, $options: 'i' } },
        ],
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual(mockResult);
    });

    it('Should throw an error if nothing is found', async () => {
      Blog.find = jest.fn().mockResolvedValue([]);

      const searchTerm = 'non existent blog';

      await expect(blogService.getBlogSearch(searchTerm)).rejects.toThrow(
        NotFoundError
      );
      await expect(blogService.getBlogSearch(searchTerm)).rejects.toThrow(
        'Nothing found'
      );
      expect(Blog.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { body: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    });
  });

  describe('create blog service', () => {
    it('should create a blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'userId',
      };

      const payload = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        author: 'user123',
      };

      Blog.create = jest.fn().mockResolvedValue(mockResult);

      const result = await blogService.createPost(payload, payload.author);

      expect(Blog.create).toHaveBeenCalledWith(payload);
      expect(typeof result).toBe('string');
    });
  });

  describe('update blog service', () => {
    it('should update a blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'userId',
      };

      const blogId = 'validId';

      const payload = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
      };

      Blog.findByIdAndUpdate = jest.fn().mockResolvedValue(mockResult);

      const result = await blogService.updatePost(payload, blogId);

      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(blogId, payload, {
        new: true,
      });

      expect(typeof result).toBe('string');
    });
  });

  describe('toggle blog likes service', () => {
    it('should like a blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'user123',
        save: jest.fn().mockReturnThis(),
      };

      Blog.findById = jest.fn().mockResolvedValue(mockResult);

      const userId = 'random userId';

      const result = await blogService.toggleBlogLike(mockResult._id, userId);

      expect(Blog.findById).toHaveBeenCalledWith(mockResult._id);
      expect(mockResult.save).toHaveBeenCalled();
      expect(mockResult.likes.length).toBeGreaterThan(0);
      expect(result).toEqual(mockResult);
    });

    it('Should throw an error if blog is not found', async () => {
      Blog.findById = jest.fn().mockResolvedValue(null);

      const blogId = 'invalidId';
      const userId = 'user123';

      await expect(blogService.toggleBlogLike(blogId, userId)).rejects.toThrow(
        NotFoundError
      );
      await expect(blogService.toggleBlogLike(blogId, userId)).rejects.toThrow(
        'blog not found'
      );
      expect(Blog.findById).toHaveBeenCalledWith(blogId);
    });
  });

  // describe('get blog comment service', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should get blog comments', async () => {
  //     const mockResult = {
  //       _id: 'validId',
  //       title: 'new blog',
  //       snippet: 'a new snippet',
  //       body: 'a new body',
  //       image: '.jpg',
  //       likes: [],
  //       comments: [
  //         {
  //           user: 'user123',
  //           post: '123',
  //           content: 'this post is shit',
  //         },
  //         {
  //           user: 'user123',
  //           post: '123',
  //           content: 'this post is not shit',
  //         },
  //       ],
  //       author: 'user123',
  //     };

  //     const blogId = 'validId';

  //     Blog.findById = jest.fn().mockResolvedValue(mockResult).populate;
  //     //Blog.populate = jest.fn().mockResolvedValue(mockResult.comments);

  //     const result = await blogService.getBlogComments(blogId);

  //     expect(Blog.findById).toHaveBeenCalledWith(blogId);
  //     expect(result.length).toBeGreaterThan(0);
  //     expect(result).toEqual(mockResult.comments);
  //   });
  // });

  describe('comment on blog service', () => {
    it('should comment on a blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comments: [],
        author: 'user123',
        save: jest.fn().mockReturnThis(),
      };

      const mockComment = {
        user: 'validId',
        post: 'validBlogId',
        content: 'this post is shit',
      };

      Blog.findById = jest.fn().mockResolvedValue(mockResult);
      Comment.create = jest.fn().mockResolvedValue(mockComment);

      const blogId = 'validBlogId';
      const userId = 'validId';

      const result = await blogService.addBlogComment(
        blogId,
        userId,
        mockComment.content
      );

      expect(Blog.findById).toHaveBeenCalledWith(blogId);
      expect(Comment.create).toHaveBeenCalledWith({
        user: userId,
        post: blogId,
        content: mockComment.content,
      });
      expect(mockResult.comments.length).toBeGreaterThan(0);
      expect(typeof result).toBe('string');
    });

    it('should throw an error if blog not found', async () => {
      Blog.findById = jest.fn().mockResolvedValue(null);

      const blogId = 'invalidId';
      const userId = 'user123';
      const content = 'this is not a comment';

      await expect(
        blogService.addBlogComment(blogId, userId, content)
      ).rejects.toThrow(NotFoundError);
      await expect(
        blogService.addBlogComment(blogId, userId, content)
      ).rejects.toThrow('blog not found');
      expect(Blog.findById).toHaveBeenCalledWith(blogId);
    });
  });

  describe('edit blog comment service', () => {
    it('should edit blog comment', async () => {
      const mockComment = {
        _id: 'validComId',
        user: 'user123',
        post: '123',
        content: 'this post is shit',
      };

      const commentId = 'validComId';

      Comment.findByIdAndUpdate = jest.fn().mockResolvedValue(mockComment);

      const newComment = 'new comment';

      const result = await blogService.editBlogComment(
        mockComment._id,
        newComment
      );

      expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
        commentId,
        { content: { $eq: newComment } },
        { new: true }
      );
      expect(typeof result).toBe('string');
    });
  });

  describe('delete blog comment service', () => {
    it('should delete blog comment', async () => {
      const mockResult = {
        _id: '123',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comments: [],
        author: 'user123',
        save: jest.fn().mockReturnThis(),
      };

      const mockComment = {
        _id: 'validComId',
        user: 'user123',
        post: '123',
        content: 'this post is shit',
        deleteOne: jest.fn().mockReturnThis(),
      };

      Comment.findById = jest.fn().mockResolvedValue(mockComment);
      Blog.updateOne = jest.fn().mockResolvedValue(mockResult);

      const result = await blogService.deleteBlogComment(mockComment._id);

      expect(Comment.findById).toHaveBeenCalledWith(mockComment._id);
      expect(mockComment.deleteOne).toHaveBeenCalled();
      expect(Blog.updateOne).toHaveBeenCalledWith(
        { comments: mockComment._id },
        { $pull: { comments: mockComment._id } }
      );
      expect(result).toBeDefined();
    });

    it('should throw an error if comment not found', async () => {
      Comment.findById = jest.fn().mockResolvedValue(null);

      const commentId = 'invalidComId';

      await expect(blogService.deleteBlogComment(commentId)).rejects.toThrow(
        NotFoundError
      );
      await expect(blogService.deleteBlogComment(commentId)).rejects.toThrow(
        'comment not found'
      );
      expect(Comment.findById).toHaveBeenCalledWith(commentId);
      expect(Blog.updateOne).not.toHaveBeenCalled();
    });
  });

  describe('delete blog service', () => {
    it('should delete the blog', async () => {
      const mockResult = {
        _id: 'validId',
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comments: [],
        author: 'user123',
        save: jest.fn().mockReturnThis(),
        deleteOne: jest.fn().mockReturnThis(),
      };

      Blog.findById = jest.fn().mockResolvedValue(mockResult);

      const result = await blogService.removePost(mockResult._id);

      expect(Blog.findById).toHaveBeenCalledWith(mockResult._id);
      expect(mockResult.deleteOne).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw an error if blog not found', async () => {
      Blog.findById = jest.fn().mockResolvedValue(null);

      const blogId = 'invalidId';

      await expect(blogService.removePost(blogId)).rejects.toThrow(
        NotFoundError
      );
      await expect(blogService.removePost(blogId)).rejects.toThrow(
        'post not found'
      );
      expect(Blog.findById).toHaveBeenCalledWith(blogId);
    });
  });
});
