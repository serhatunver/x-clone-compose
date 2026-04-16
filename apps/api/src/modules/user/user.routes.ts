import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getProfileSchema, updateProfileSchema } from '@repo/shared';

const router = Router();

router.get('/:username', protect, validate(getProfileSchema), getProfile);
router.patch('/update', protect, validate(updateProfileSchema), updateProfile);

export default router;
