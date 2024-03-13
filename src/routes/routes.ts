import express, { Router } from 'express';

const router: Router = Router();

import authorRoutes from './writers.routes';
import blogRoutes from './blog.routes';

export default router;