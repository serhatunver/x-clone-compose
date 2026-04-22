import type { Request, Response } from 'express';
import type { ValidatedRequest } from '#/types/api.types.js';
import { config } from '#/config/config.js';
import { authService } from './auth.service.js';
import type {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@repo/shared';
import { RESPONSE_KEYS, HTTP_STATUS } from '@repo/shared';
import { sendResponse } from '#/lib/http/response.js';

const authConfig = config.auth;
const isProduction = config.app.isProduction;

/**
 * Handle user registration
 */
export const register = async (req: ValidatedRequest<typeof registerSchema>, res: Response) => {
  const registerData = req.validated.body;
  const user = await authService.register(registerData);

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.REGISTER, { user }, HTTP_STATUS.CREATED);
};

/**
 * Handle user login and set cookie
 */
export const login = async (req: ValidatedRequest<typeof loginSchema>, res: Response) => {
  const loginData = req.validated.body;
  const { user, token, message } = await authService.login(loginData);

  res.cookie('auth.token', token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: isProduction, // Only send cookie over HTTPS in production
    sameSite: authConfig.cookie.sameSite, // Prevents CSRF attacks
    maxAge: authConfig.cookie.maxAge, // Cookie expiration time
    path: '/', // Cookie is valid for the entire site
  });

  return sendResponse(res, message, { user, token });
};

/**
 * Handle user logout and clear cookie
 */
export const logout = (_req: Request, res: Response) => {
  res.clearCookie('auth.token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: authConfig.cookie.sameSite,
    path: '/',
  });

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.LOGOUT);
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const user = await authService.getMe(userId);

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.GET_ME, { user });
};

/**
 * Verify user's email using token
 */
export const verifyEmail = async (
  req: ValidatedRequest<typeof verifyEmailSchema>,
  res: Response,
) => {
  const { token } = req.validated.params;
  const result = await authService.verifyEmail(token);

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.EMAIL_VERIFIED, result);
};

/**
 * Resend email verification link to user's email
 */
export const resendVerificationEmail = async (
  req: ValidatedRequest<typeof resendVerificationEmailSchema>,
  res: Response,
) => {
  const { email } = req.validated.body;
  const result = await authService.resendVerificationEmail(email);

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.VERIFICATION_EMAIL_SENT, result);
};

/**
 * Send password reset email with token
 */
export const forgotPassword = async (
  req: ValidatedRequest<typeof forgotPasswordSchema>,
  res: Response,
) => {
  const { email } = req.validated.body;
  const { message, debugToken } = await authService.forgotPassword(email);

  const result = {
    message,
    debugToken,
  };

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.PASSWORD_RESET_EMAIL_SENT, result);
};

/**
 * Reset user password using token
 */
export const resetPassword = async (
  req: ValidatedRequest<typeof resetPasswordSchema>,
  res: Response,
) => {
  const { token } = req.validated.params;
  const { password } = req.validated.body;
  const result = await authService.resetPassword(token, password);

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.PASSWORD_CHANGED, result);
};
