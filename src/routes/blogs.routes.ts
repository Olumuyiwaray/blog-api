import { Router } from 'express';
import controllers from '../controllers/blog.controllers';
import { validate, validateBlogPost, validateQuery } from '../utils/validate';
import upload from '../config/multer';
import { checkPermission } from '../middlewares/permission';
import authMiddleware from '../middlewares/auth';

const blogRouter: Router = Router();

blogRouter.get('/', controllers.getAllBlogs);
blogRouter.get('/search', validateQuery, validate, controllers.searchBlogs);
blogRouter.get('/:blogId', controllers.getBlogById);
blogRouter.get('/comments/:blogId', controllers.getComments);

blogRouter.post(
  '/add-new',
  upload.single('image'),
  authMiddleware,
  validateBlogPost,
  validate,
  controllers.createBlog
);
// blogRouter.post('/like/:blogId', authMiddleware, controllers.toggleBlogLike);
blogRouter.post('/comment/:blogId', authMiddleware, controllers.addComment);
blogRouter.put(
  '/edit/:blogId',
  authMiddleware,
  checkPermission,
  controllers.editBlog
);
blogRouter.put('/comment/:commentId', authMiddleware, controllers.editComment);
blogRouter.delete(
  '/delete/:blogId',
  authMiddleware,
  checkPermission,
  controllers.deleteComment
);
blogRouter.delete(
  '/comment/:commentId',
  authMiddleware,
  controllers.deleteBlog
);
export default blogRouter;
