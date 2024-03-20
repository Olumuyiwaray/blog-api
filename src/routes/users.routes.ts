import express, { Router } from 'express';
import {
  addPost,
  deletePost,
  editPost,
  logIn,
  logOut,
  register,
} from '../controllers/userControllers';
import { validate, validateLogin, validateSignup } from '../utils/validate';
import AuthMiddleware from '../middlewares/auth';

const router: Router = Router();

router.get('/dash', AuthMiddleware, (req, res) => {
  if (req.user) {
    res.send(
      `Oi dashboard username: ${req.user.username} id: ${req.user.userId}`
    );
  } else {
    res.send(`Oi dashboard no username and no id`);
  }
});
router.post('/register', validateSignup, validate, register);
router.post('/login', validateLogin, validate, logIn);
router.get('/logout', logOut);
router.post('/add-new', AuthMiddleware, addPost);
router.put('/edit/:id', AuthMiddleware, editPost);
router.delete('/delete/:id', AuthMiddleware, deletePost);

export default router;
