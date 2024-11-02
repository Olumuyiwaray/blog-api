import { Router } from 'express';
import controllers from '../controllers/blog.controllers';
import { validate, validateBlogPost, validateQuery } from '../utils/validate';
import upload from '../config/multer';
import { checkPermission } from '../middlewares/permission';
import authMiddleware from '../middlewares/auth';

const blogRouter: Router = Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags:
 *       - Blogs
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
blogRouter.get('/', controllers.getAllBlogs);

/**
 * @swagger
 * /blogs/search:
 *   get:
 *     summary: Search for blogs
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
blogRouter.get('/search', validateQuery, validate, controllers.searchBlogs);

/**
 * @swagger
 * /blogs/{blogId}:
 *   get:
 *     summary: Get a blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the blog
 *     responses:
 *       200:
 *         description: A blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref:'#/components/schemas/Blog'
 */
blogRouter.get('/:blogId', controllers.getBlogById);

/**
 * @swagger
 * /blogs/{blogId}/comments:
 *   get:
 *     summary: Get all comments of a blog
 *     tags:
 *       - Blogs
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the blog
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
blogRouter.get('/comments/:blogId', controllers.getComments);

/**
 * @swagger
 * /blogs/add-new:
 *   post:
 *     summary: Create a new blog
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 required: true
 *                 description: The title of the blog
 *               snippet:
 *                 type: string
 *                 required: true
 *                 description: The snippet of the blog
 *               body:
 *                 type: string
 *                 required: true
 *                 description: The body of the blog
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image of the blog
 *     responses:
 *       201:
 *         description: The created blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
blogRouter.post(
  '/add-new',
  upload.single('image'),
  authMiddleware,
  validateBlogPost,
  validate,
  controllers.createBlog
);
// blogRouter.post('/like/:blogId', authMiddleware, controllers.toggleBlogLike);

/**
 * @swagger
 * /blogs/{blogId}/comment:
 *   post:
 *     summary: Add a comment to a blog
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The id of the blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 required: true
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
blogRouter.post('/comment/:blogId', authMiddleware, controllers.addComment);

/**
 * @swagger
 * /blogs/edit/{blogId}:
 *   put:
 *     summary: Edit an existing blog
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The id of the blog to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the blog
 *               snippet:
 *                 type: string
 *                 description: The new snippet of the blog
 *               body:
 *                 type: string
 *                 description: The new body of the blog
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 */
blogRouter.put(
  '/edit/:blogId',
  authMiddleware,
  checkPermission,
  controllers.editBlog
);

/**
 * @swagger
 * /blogs/comment/{commentId}:
 *   put:
 *     summary: Edit an existing comment
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The id of the comment to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The new content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
blogRouter.put('/comment/:commentId', authMiddleware, controllers.editComment);

/**
 * @swagger
 * /blogs/comment/{commentId}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The id of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
blogRouter.delete(
  '/comment/:commentId',
  authMiddleware,
  controllers.deleteComment
);

/**
 * @swagger
 * /blogs/delete/{blogId}:
 *   delete:
 *     summary: Deletes a blog
 *     tags:
 *       - Blogs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: The id of the blog from which the comment will be deleted
 *     responses:
 *       200:
 *         description: blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
blogRouter.delete(
  '/delete/:blogId',
  authMiddleware,
  checkPermission,
  controllers.deleteBlog
);

export default blogRouter;
