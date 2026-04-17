import { Router } from 'express';
import { toggleFollow, getFollowers, getFollowing } from './follow.controller.js';
import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { followToggleSchema, followListSchema } from '@repo/shared';

const router = Router();

/**
 * POST /api/follow/:userId
 * Toggle follow/unfollow status for the user with the given ID. The authenticated user will follow or unfollow the target user based on the current status.
 */
router.post('/:userId', protect, validate(followToggleSchema), toggleFollow);

/**
 * GET /api/follow/:userId/followers
 * Get a list of users that are following the user with the given ID
 */
router.get('/:userId/followers', protect, validate(followListSchema), getFollowers);

/**
 * GET /api/follow/:userId/following
 * Get a list of users that the user with the given ID is following
 */
router.get('/:userId/following', protect, validate(followListSchema), getFollowing);

export default router;
