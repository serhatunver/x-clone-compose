import { Router } from 'express';
import { protect } from '#/middlewares/auth.middleware.js';
import { getUserProfile, getSuggestedUsers, updateUserProfile } from './user.controller.js';

const router = Router();

router.get('/profile/:username', protect, getUserProfile);
router.get('/suggested', protect, getSuggestedUsers);
router.post('/update', protect, updateUserProfile);

export default router;
