import { Router } from 'express';
import controllers from '../controllers/user.controllers';
import { validate, validateLogin, validateSignup } from '../utils/validate';
import upload from '../config/multer';
import authMiddleware from '../middlewares/auth';
import { loginagentcheck } from '../middlewares/loginagentcheck';

const router: Router = Router();

/**
 * @swagger
 * /users/account:
 *   get:
 *     summary: Get user account details
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/account', authMiddleware, controllers.getUserById);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get('/logout', controllers.logOut);

/**
 * @swagger
 * /users/verification/{token}:
 *   get:
 *     summary: Verify email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Successfully verified
 */
router.get('/verification/:token', controllers.verifyRegisterationEmail);

/**
 * @swagger
 * /users/reset/{token}:
 *   get:
 *     summary: Verify reset code
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset code
 *     responses:
 *       200:
 *         description: Successfully verified
 */
router.get('/reset/:token', controllers.verifyResetCode);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Send password reset link
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Forgot password request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully sent password reset link
 */
router.post('/forgot-password', controllers.sendResetCode);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Successfully registered
 */
router.post(
  '/register',
  upload.single('profile_image'),
  validateSignup,
  validate,
  controllers.registerUser
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Users
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 format: password
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post(
  '/login',
  loginagentcheck,
  validateLogin,
  validate,
  controllers.loginUser
);

/**
 * @swagger
 * /users/change-username:
 *   put:
 *     summary: Change username
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       description: New username
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               newUsername:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully changed username
 */
router.put('/change-username', authMiddleware, controllers.changeUsername);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change password
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       description: New password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 required: true
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully changed password
 */
router.put('/change-password', authMiddleware, controllers.changePassword);

/**
 * @swagger
 * /users/reset/{token}:
 *   put:
 *     summary: Reset password
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset code
 *     requestBody:
 *       description: New password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 required: true
 *     responses:
 *       200:
 *         description: Successfully reset password
 */
router.put('/reset/:token', controllers.resetPassword);

export default router;
