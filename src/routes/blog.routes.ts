import express, { Router } from 'express';
import { getPost, getPosts, searchPosts } from '../controllers/blogControllers';

const router: Router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/search', searchPosts);

export default router;