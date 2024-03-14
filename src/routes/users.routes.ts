import express, { Router } from 'express';
import { addPost, deletePost, editPost, logIn, logOut, register } from '../controllers/userControllers';
import { validate, validateSignup } from '../utils/validate';

const router: Router = Router();


router.post('/register',validateSignup, validate, register);
router.post('login', logIn);
router.post('/add-new', addPost);
router.put('/edit/:id', editPost);
router.delete('/delete/:id', deletePost);
router.get('logout', logOut);

export default router;