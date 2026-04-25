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
import { UnauthorizedError } from '#/lib/errors/index.js';

const authConfig = config.auth;

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
  const { user, accessToken, refreshToken, message } = await authService.login(loginData);

  res.cookie('auth.token', accessToken, authConfig.cookie.getAccessOptions());
  res.cookie('auth.refresh_token', refreshToken, authConfig.cookie.getRefreshOptions());

  return sendResponse(res, message, { user, token: accessToken });
};

/**
 * Handle user logout and clear cookie
 */
export const logout = async (req: Request, res: Response) => {
  const { jti, exp } = req.user;

  await authService.logout(jti, exp);

  res.clearCookie('auth.token', authConfig.cookie.getAccessOptions());
  res.clearCookie('auth.refresh_token', authConfig.cookie.getRefreshOptions());

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

export const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies as Record<string, string | undefined>;
  const refreshToken = cookies['auth.refresh_token'];

  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshTokens(refreshToken);

  res.cookie('auth.token', accessToken, authConfig.cookie.getAccessOptions());
  res.cookie('auth.refresh_token', newRefreshToken, authConfig.cookie.getRefreshOptions());

  return sendResponse(res, RESPONSE_KEYS.SUCCESS.AUTH.TOKEN_REFRESHED);
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

  return sendResponse(res, message, { debugToken });
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
  const { user, message } = await authService.resetPassword(token, password);

  return sendResponse(res, message, { user });
};
