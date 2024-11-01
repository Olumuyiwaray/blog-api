import { Request, Response } from 'express';
import { Blog } from '../../../models/blog';
import { checkPermission } from '../../../middlewares/permission';
import mongoose from 'mongoose';

jest.mock('../../../models/Blog');

describe('Permission test', () => {
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

  it('should call next if author is allowed to make changes', async () => {
    req.user = {
      userId: 'userId',
      username: 'username',
    };

    req.params = {
      blogId: 'validId',
    };

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

    (Blog.findById as jest.Mock).mockResolvedValue(mockResult);

    await checkPermission(req, res, next);

    expect(Blog.findById).toHaveBeenCalledWith(req.params.blogId);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should return 404 not found if blog not found', async () => {
    req.user = {
      userId: 'userId',
      username: 'username',
    };

    req.params = {
      blogId: 'validId',
    };

    (Blog.findById as jest.Mock).mockResolvedValue(null);

    await checkPermission(req, res, next);

    expect(Blog.findById).toHaveBeenCalledWith(req.params.blogId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'blog not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 unauthourized if author is not allowed to make changes', async () => {
    req.user = {
      userId: 'userId',
      username: 'username',
    };

    req.params = {
      blogId: 'validId',
    };

    const mockResult = {
      _id: 'validId',
      title: 'new blog',
      snippet: 'a new snippet',
      body: 'a new body',
      image: '.jpg',
      likes: [],
      comment: [],
      author: new mongoose.Types.ObjectId(),
    };

    (Blog.findById as jest.Mock).mockResolvedValue(mockResult);
    // Mock the equals method
    mockResult.author.equals = jest.fn().mockReturnValue(false);

    await checkPermission(req, res, next);

    expect(Blog.findById).toHaveBeenCalledWith(req.params.blogId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized operation',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass all other errors to the error middleware', async () => {
    req.user = {
      userId: 'userId',
      username: 'username',
    };

    req.params = {
      blogId: 'validId',
    };

    const mockError = new Error('An error occured');

    (Blog.findById as jest.Mock).mockRejectedValue(mockError);

    await checkPermission(req, res, next);

    expect(Blog.findById).toHaveBeenCalledWith(req.params.blogId);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
