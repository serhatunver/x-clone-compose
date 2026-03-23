import { Router } from 'express';
import protectRoute from '../../middleware/protectRoute.js';
import { getUserProfile, getSuggestedUsers, updateUserProfile } from './controller.js';

const router = Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/update', protectRoute, updateUserProfile);

export default router;
