import { Router } from 'express';
import { toggleFollow } from './follow.controller.js';
import protectRoute from '#/middleware/protectRoute.js';

const router = Router();

router.post('/toggle/:id', protectRoute, toggleFollow);

export default router;
