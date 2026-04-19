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

/**
 * Handle user registration
 */
export const register = async (req: ValidatedRequest<typeof registerSchema>, res: Response) => {
  const registerData = req.validated.body;
  const user = await authService.register(registerData);

  return res.status(201).json({ message: 'User created successfully', user });
};

/**
 * Handle user login and set cookie
 */
export const login = async (req: ValidatedRequest<typeof loginSchema>, res: Response) => {
  const loginData = req.validated.body;
  const { user, token } = await authService.login(loginData);

  res.cookie('auth.token', token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: config.app.isProduction, // Only send cookie over HTTPS in production
    sameSite: config.security.auth.cookie.sameSite, // Prevents CSRF attacks
    maxAge: config.security.auth.cookie.maxAge, // Cookie expiration time
    path: '/', // Cookie is valid for the entire site
  });

  return res.status(200).json({ user, token });
};

/**
 * Handle user logout and clear cookie
 */
export const logout = (_req: Request, res: Response) => {
  res.clearCookie('auth.token', {
    httpOnly: true,
    secure: config.app.isProduction,
    sameSite: config.security.auth.cookie.sameSite,
    path: '/',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const user = await authService.getMe(userId);

  return res.status(200).json(user);
};

/**
 * Handle email verification using token
 * @param token - Email verification token sent to user's email
 * @return JSON response indicating success or failure of email verification
 */
export const verifyEmail = async (
  req: ValidatedRequest<typeof verifyEmailSchema>,
  res: Response,
) => {
  const { token } = req.validated.params;
  const result = await authService.verifyEmail(token);
  return res.status(200).json(result);
};

// export const resendVerificationEmail = async (req: Request, res: Response) => {
//   const userId = req.user._id;
//   const result = await authService.resendVerificationEmail(userId);
//   return res.status(200).json(result);
// }

export const resendVerificationEmail = async (
  req: ValidatedRequest<typeof resendVerificationEmailSchema>,
  res: Response,
) => {
  const { email } = req.validated.body;
  const result = await authService.resendVerificationEmail(email);
  return res.status(200).json(result);
};

/**
 * Send password reset email
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

  return res.status(200).json(result);
};

/**
 * Reset password using token
 */
export const resetPassword = async (
  req: ValidatedRequest<typeof resetPasswordSchema>,
  res: Response,
) => {
  const { token } = req.validated.params;
  const { password } = req.validated.body;
  const result = await authService.resetPassword(token, password);
  return res.status(200).json(result);
};
