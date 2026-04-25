import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refresh,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from './auth.controller.js';
import { validate } from '#/middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@repo/shared';
import { protect } from '#/middlewares/auth.middleware.js';
import { authLimiter } from '#/middlewares/rate-limit.middleware.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);

router.get('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);
router.post(
  '/resend-verification-email',
  validate(resendVerificationEmailSchema),
  resendVerificationEmail,
);

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
