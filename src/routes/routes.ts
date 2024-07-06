import express, { Router } from 'express';

const router: Router = Router();

import userRoutes from './users.routes';
import indexRoutes from './blogs.routes';



router.use(indexRoutes);
router.use('/users', userRoutes);

export default router;
