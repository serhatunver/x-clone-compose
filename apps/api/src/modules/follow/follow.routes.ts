import { Router } from 'express';
import { toggleFollow } from './follow.controller.js';
import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { followParamsSchema } from '@repo/validators';

const router = Router();

/**
 * POST /api/follow/:ids
 * Toggle follow status for the user with the given ID
 */
router.post('/:id', protect, validate(followParamsSchema), toggleFollow);

export default router;
