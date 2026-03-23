import { Router } from 'express';
import { toggleFollow } from './controller.js';
import protectRoute from '../../middleware/protectRoute.js';

const router = Router();

// Endpoint: POST /api/follows/toggle/:id
router.post('/toggle/:id', protectRoute, toggleFollow);

export default router;
