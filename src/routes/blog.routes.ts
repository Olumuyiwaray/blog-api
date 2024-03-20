import express, { Router } from 'express';
import { getPost, getPosts, searchPosts } from '../controllers/blogControllers';
import { validate, validateQuery } from '../utils/validate';

const router: Router = Router();

router.get('/', getPosts);
router.get('/search', validateQuery, validate, searchPosts);
router.get('/:id', getPost);

export default router;
