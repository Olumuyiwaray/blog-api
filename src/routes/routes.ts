import express, { Router } from 'express';

const router: Router = Router();

import userRoutes from './users.routes';
import blogRoutes from './blogs.routes';




/**
 * Blog routes
 *
 * @module routes
 * @description Routes related to blog operations
 */
router.use('/blogs', blogRoutes);

/**
 * User routes
 *
 * @module routes
 * @description Routes related to user operations
 */
router.use('/users', userRoutes);

export default router;
