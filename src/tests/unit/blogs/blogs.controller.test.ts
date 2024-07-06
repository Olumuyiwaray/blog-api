import {
  getBlogs,
  getBlog,
  searchBlogs,
  createBlog,
  editBlog,
  toggleLike,
  getComments,
  addComment,
  editComment,
  deleteComment,
  deletePost,
} from '../../../controllers/blog.controllers';
import * as blogService from '../../../services/blogs.service';
import { Request, Response } from 'express';
import { NotFoundError } from '../../../lib/customErrors';

jest.mock('../../../services/blogs.service');

describe('blog controllers', () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get all posts controller', () => {
    it('should return a list of blog posts when the database has data', async () => {
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

      (blogService.getAllBlogs as jest.Mock).mockResolvedValue(mockResult);
      await getBlogs(req, res, next);

      expect(blogService.getAllBlogs).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      const mockError = new NotFoundError('No posts found');
      (blogService.getAllBlogs as jest.Mock).mockRejectedValue(mockError);

      await getBlogs(req, res, next);

      expect(blogService.getAllBlogs).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('get single post', () => {
    it('should return a 200 status code and the post object when a valid id is provided', async () => {
      req.params = {
        blogId: 'validId',
      };

      const mockResult = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'userId',
      };

      (blogService.getSingleBlog as jest.Mock).mockResolvedValue(mockResult);

      await getBlog(req, res, next);

      expect(blogService.getSingleBlog).toHaveBeenCalledWith('validId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(next).not.toHaveBeenCalled();
    });

    // Should handle unexpected errors and call the next middleware function
    it('should handle errors and call the next middleware function', async () => {
      req.params = {
        blogId: 'invalidId',
      };

      const mockError = new NotFoundError('No posts found');
      (blogService.getSingleBlog as jest.Mock).mockRejectedValue(mockError);

      await getBlog(req, res, next);

      expect(blogService.getSingleBlog).toHaveBeenCalledWith('invalidId');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Search database for post', () => {
    // Search query matches title of a blog post
    it('should return the blog post with matching title when search query matches title', async () => {
      req.query = {
        search: 'new blog',
      };
      const search = req.query.search;

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
      (blogService.getBlogSearch as jest.Mock).mockResolvedValue(mockResult);

      await searchBlogs(req, res, next);

      expect(blogService.getBlogSearch).toHaveBeenCalledWith(search);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    // Returns 404 when no blog post matches the search query
    it('should handle errors and call the next middleware function', async () => {
      req.query = {
        search: 'nonexistent example',
      };
      const search = req.query.search;

      const mockError = new NotFoundError('Nothing found');

      (blogService.getBlogSearch as jest.Mock).mockRejectedValue(mockError);

      await searchBlogs(req, res, next);

      expect(blogService.getBlogSearch).toHaveBeenCalledWith(search);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('create blog', () => {
    // Search query matches title of a blog post
    it('should create a new blog', async () => {
      const blogCreationDetails = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
      };

      req.body = blogCreationDetails;
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      const mockResult = 'blog created';

      (blogService.createPost as jest.Mock).mockResolvedValue(mockResult);

      await createBlog(req, res, next);

      expect(blogService.createPost).toHaveBeenCalledWith(
        blogCreationDetails,
        req.user.userId
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: mockResult });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      const blogCreationDetails = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
      };

      req.body = blogCreationDetails;
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      const mockError = new Error('Unable to create blog try again later');

      (blogService.createPost as jest.Mock).mockRejectedValue(mockError);

      await createBlog(req, res, next);

      expect(blogService.createPost).toHaveBeenCalledWith(
        blogCreationDetails,
        req.user.userId
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('update blog', () => {
    // Search query matches title of a blog post
    it('should edit existing blog', async () => {
      const blogUpdateDetails = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
      };

      req.body = blogUpdateDetails;
      req.params = {
        blogId: 'validId',
      };

      const mockResult = 'blog edited successfully';
      (blogService.updatePost as jest.Mock).mockResolvedValue(mockResult);

      await editBlog(req, res, next);

      expect(blogService.updatePost).toHaveBeenCalledWith(
        blogUpdateDetails,
        req.params.blogId
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      const blogUpdateDetails = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
      };

      req.body = blogUpdateDetails;
      req.params = {
        blogId: 'validId',
      };
      const mockError = new Error('Unable to update blog try again later');

      (blogService.updatePost as jest.Mock).mockRejectedValue(mockError);

      await editBlog(req, res, next);

      expect(blogService.updatePost).toHaveBeenCalledWith(
        blogUpdateDetails,
        req.params.blogId
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('like blog', () => {
    // Search query matches title of a blog post
    it("should like a blog that hasn't been liked", async () => {
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      req.params = {
        blogId: 'validId',
      };

      const mockResult = {
        title: 'new blog',
        snippet: 'a new snippet',
        body: 'a new body',
        image: '.jpg',
        likes: [],
        comment: [],
        author: 'userId',
      };
      (blogService.toggleBlogLike as jest.Mock).mockResolvedValue(mockResult);

      await toggleLike(req, res, next);

      expect(blogService.toggleBlogLike).toHaveBeenCalledWith(
        req.params.blogId,
        req.user.userId
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        result: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      req.params = {
        blogId: 'invalidId',
      };

      const mockError = new NotFoundError('blog not found');

      (blogService.toggleBlogLike as jest.Mock).mockRejectedValue(mockError);

      await toggleLike(req, res, next);

      expect(blogService.toggleBlogLike).toHaveBeenCalledWith(
        req.params.blogId,
        req.user.userId
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('get blog comments', () => {
    // Search query matches title of a blog post
    it("should like a blog that hasn't been liked", async () => {
      req.params = {
        blogId: 'validId',
      };

      const mockResult = [
        {
          user: 'user123',
          post: '123',
          content: 'this post is shit',
        },
      ];
      (blogService.getBlogComments as jest.Mock).mockResolvedValue(mockResult);

      await getComments(req, res, next);

      expect(blogService.getBlogComments).toHaveBeenCalledWith(
        req.params.blogId
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        result: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.params = {
        blogId: 'invalidId',
      };

      const mockError = new NotFoundError('blog not found');

      (blogService.getBlogComments as jest.Mock).mockRejectedValue(mockError);

      await getComments(req, res, next);

      expect(blogService.getBlogComments).toHaveBeenCalledWith(
        req.params.blogId
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('create blog comments', () => {
    // Search query matches title of a blog post
    it("should like a blog that hasn't been liked", async () => {
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      req.params = {
        blogId: 'validId',
      };

      req.body = {
        content: 'this post is shit',
      };

      const mockResult = 'comment added sucessfully';

      (blogService.addBlogComment as jest.Mock).mockResolvedValue(mockResult);

      await addComment(req, res, next);

      expect(blogService.addBlogComment).toHaveBeenCalledWith(
        req.params.blogId,
        req.user.userId,
        req.body.content
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.user = {
        userId: 'userId',
        username: 'username',
      };

      req.params = {
        blogId: 'invalidId',
      };

      req.body = {
        content: 'this post is shit',
      };

      const mockError = new NotFoundError('blog not found');

      (blogService.addBlogComment as jest.Mock).mockRejectedValue(mockError);

      await addComment(req, res, next);

      expect(blogService.addBlogComment).toHaveBeenCalledWith(
        req.params.blogId,
        req.user.userId,
        req.body.content
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('edit blog comments', () => {
    // Search query matches title of a blog post
    it('should edit already existing comment', async () => {
      req.params = {
        commentId: 'validId',
      };

      req.body = {
        content: 'this post is shit',
      };

      const mockResult = 'comment edited successfully';

      (blogService.editBlogComment as jest.Mock).mockResolvedValue(mockResult);

      await editComment(req, res, next);

      expect(blogService.editBlogComment).toHaveBeenCalledWith(
        req.params.commentId,
        req.body.content
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.params = {
        commentId: 'validId',
      };

      req.body = {
        content: 'this post is shit',
      };

      const mockError = new Error('Unable to edit comment try again later');

      (blogService.editBlogComment as jest.Mock).mockRejectedValue(mockError);

      await editComment(req, res, next);

      expect(blogService.editBlogComment).toHaveBeenCalledWith(
        req.params.commentId,
        req.body.content
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('delete blog comments', () => {
    // Search query matches title of a blog post
    it('should delete already existing comment', async () => {
      req.params = {
        commentId: 'validId',
      };

      const mockResult = 'Comment succesfully removed';

      (blogService.deleteBlogComment as jest.Mock).mockResolvedValue(
        mockResult
      );

      await deleteComment(req, res, next);

      expect(blogService.deleteBlogComment).toHaveBeenCalledWith(
        req.params.commentId
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.params = {
        commentId: 'invalidId',
      };

      const mockError = new NotFoundError('comment not found');

      (blogService.deleteBlogComment as jest.Mock).mockRejectedValue(mockError);

      await deleteComment(req, res, next);

      expect(blogService.deleteBlogComment).toHaveBeenCalledWith(
        req.params.commentId
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('delete blog', () => {
    // Search query matches title of a blog post
    it('should delete already existing blog', async () => {
      req.params = {
        blogId: 'validId',
      };

      const mockResult = 'Post succesfully removed';

      (blogService.removePost as jest.Mock).mockResolvedValue(mockResult);

      await deletePost(req, res, next);

      expect(blogService.removePost).toHaveBeenCalledWith(req.params.blogId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: mockResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and call the next middleware function', async () => {
      req.params = {
        blogId: 'invalidId',
      };

      const mockError = new NotFoundError('post not found');

      (blogService.removePost as jest.Mock).mockRejectedValue(mockError);

      await deletePost(req, res, next);

      expect(blogService.removePost).toHaveBeenCalledWith(req.params.blogId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
