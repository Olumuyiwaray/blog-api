import { Router } from 'express';
import {
  changePassword,
  changeUsername,
  getUSer,
  logIn,
  logOut,
  register,
  resetPassword,
  sendResetLink,
  verifyRegisteredEmail,
  verifyResetLink,
} from '../controllers/user.controllers';
import { validate, validateLogin, validateSignup } from '../utils/validate';
import upload from '../config/multer';
import authMiddleware from '../middlewares/auth';

const router: Router = Router();

router.get('/account', authMiddleware, getUSer);
router.get('/logout', logOut);
router.get('/verify/:token', verifyRegisteredEmail);
router.get('/reset/:token', verifyResetLink);

router.post('/forgot-password', sendResetLink);
router.post(
  '/register',
  upload.single('profile_image'),
  validateSignup,
  validate,
  register
);
router.post('/login', validateLogin, validate, logIn);

router.put('/change-username', authMiddleware, changeUsername);
router.put('/change-password', authMiddleware, changePassword);
router.put('/reset/:token', resetPassword);

export default router;
