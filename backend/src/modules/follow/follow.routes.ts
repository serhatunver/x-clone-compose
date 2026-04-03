import { Router } from 'express';
import { toggleFollow } from './follow.controller.js';
import { protect } from '#/middlewares/auth.middleware.js';

const router = Router();

router.post('/toggle/:id', protect, toggleFollow);

export default router;
