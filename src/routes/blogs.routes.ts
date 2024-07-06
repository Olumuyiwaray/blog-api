import { Router } from 'express';
import {
  addComment,
  createBlog,
  deleteComment,
  deletePost,
  editComment,
  editBlog,
  getBlogs,
  getBlog,
  searchBlogs,
  toggleLike,
  getComments,
} from '../controllers/blog.controllers';
import { validate, validateBlogPost, validateQuery } from '../utils/validate';
import upload from '../config/multer';
import { checkPermission } from '../middlewares/permission';
import authMiddleware from '../middlewares/auth';

const router: Router = Router();

router.get('/', getBlogs);
router.get('/search', validateQuery, validate, searchBlogs);
router.get('/:blogId', getBlog);
router.get('/comments/:blogId', getComments);

router.post(
  '/add-new',
  upload.single('image'),
  authMiddleware,
  validateBlogPost,
  validate,
  createBlog
);
router.post('/like/:blogId', authMiddleware, toggleLike);
router.post('/comment/:blogId', authMiddleware, addComment);

router.put('/edit/:blogId', authMiddleware, checkPermission, editBlog);
router.put('/comment/:commentId', authMiddleware, editComment);

router.delete('/delete/:blogId', authMiddleware, checkPermission, deletePost);
router.delete('/comment/:commentId', authMiddleware, deleteComment);
export default router;
