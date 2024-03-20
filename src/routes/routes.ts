import express, { Router } from 'express';

const router: Router = Router();

import userRoutes from './users.routes';
import blogRoutes from './blog.routes';

router.use('/user', userRoutes);
router.use('/blog', blogRoutes);

export default router;
