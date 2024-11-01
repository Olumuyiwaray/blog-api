import express, { Router } from 'express';

const router: Router = Router();

import userRoutes from './users.routes';
import blogRoutes from './blogs.routes';

router.use('/blogs', blogRoutes);
router.use('/users', userRoutes);

export default router;
