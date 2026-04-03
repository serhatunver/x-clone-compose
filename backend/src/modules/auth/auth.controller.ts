import type { Request, Response } from 'express';
import { config } from '#/config/config.js';
import { authService } from './auth.service.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.validation.js';

/**
 * Handle user registration
 */
export const register = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterInput>,
  res: Response,
) => {
  const user = await authService.register(req.body);
  return res.status(201).json({ message: 'User created successfully', user });
};

/**
 * Handle user login and set cookie
 */
export const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginInput>,
  res: Response,
) => {
  const { user, token } = await authService.login(req.body);

  res.cookie('auth.token', token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: config.app.isProduction, // Only send cookie over HTTPS in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: config.auth.cookieMaxAge, // Cookie expiration time
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
    sameSite: 'strict',
    path: '/',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user._id.toString();
  const user = await authService.getMe(userId);

  return res.status(200).json(user);
};

/**
 * Send password reset email
 */
export const forgotPassword = async (
  req: Request<Record<string, never>, Record<string, never>, ForgotPasswordInput>,
  res: Response,
) => {
  const { email } = req.body;
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
  req: Request<{ token: string }, Record<string, never>, ResetPasswordInput>,
  res: Response,
) => {
  const { token } = req.params;
  const { password } = req.body;
  const result = await authService.resetPassword(token, password);
  return res.status(200).json(result);
};
