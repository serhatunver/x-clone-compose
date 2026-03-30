import { Router } from 'express';
import { getMe, register, login, logout } from './auth.controller.js';
import protectRoute from '#/middleware/protectRoute.js';
import { validate } from '#/middleware/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

router.get('/me', protectRoute, getMe);
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/login', login);
router.post('/logout', logout);

export default router;
