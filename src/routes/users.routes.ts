import { Router } from 'express';
import controllers from '../controllers/user.controllers';
import { validate, validateLogin, validateSignup } from '../utils/validate';
import upload from '../config/multer';
import authMiddleware from '../middlewares/auth';
import { loginagentcheck } from '../middlewares/loginagentcheck';

const router: Router = Router();

router.get('/account', authMiddleware, controllers.getUserById);
router.get('/logout', controllers.logOut);
router.get('/verification/:token', controllers.verifyRegisterationEmail);
router.get('/reset/:token', controllers.verifyResetCode);

router.post('/forgot-password', controllers.sendResetCode);
router.post(
  '/register',
  upload.single('profile_image'),
  validateSignup,
  validate,
  controllers.registerUser
);
router.post(
  '/login',
  loginagentcheck,
  validateLogin,
  validate,
  controllers.loginUser
);

router.put('/change-username', authMiddleware, controllers.changeUsername);
router.put('/change-password', authMiddleware, controllers.changePassword);
router.put('/reset/:token', controllers.resetPassword);

export default router;
