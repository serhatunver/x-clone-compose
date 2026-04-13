import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getProfileParamsSchema, updateProfileSchema } from '@repo/validators';

const router = Router();

router.get('/:username', protect, validate(getProfileParamsSchema), getProfile);
router.patch('/update', protect, validate(updateProfileSchema), updateProfile);

export default router;
