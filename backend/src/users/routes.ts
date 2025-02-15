import { Router } from 'express';
import protectRoute from '../middleware/protectRoute';
import { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUserProfile } from './controller';

const router = Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/follow/:id', protectRoute, followUnfollowUser);
router.post('/update', protectRoute, updateUserProfile);

export default router;
