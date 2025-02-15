import { Router } from 'express';
import { getMe, register, login, logout } from './controller';
import protectRoute from '../middleware/protectRoute';

const router = Router();

router.get('/me', protectRoute, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
