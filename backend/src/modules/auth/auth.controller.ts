import type { Request, Response } from 'express';
import { config } from '#/config/config.js';
import { comparePassword } from '#/lib/utils/crypto.js';
import User from '#/modules/user/user.model.js';
import generateToken from '#/lib/utils/generateToken.js';
import type { RegisterInput, LoginInput } from './auth.validation.js';
import { AppError } from '#/lib/utils/AppError.js';

const register = async (
  req: Request<Record<string, never>, Record<string, never>, RegisterInput>,
  res: Response,
) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already exist.' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already exist.' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    return res.status(401).json({
      message: 'User not created',
      error: (error as Error).message,
    });
  }
};

const login = async (
  req: Request<Record<string, never>, Record<string, never>, LoginInput>,
  res: Response,
) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select('+password');

  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Invalid credentials. Check your username/email and password.', 401);
  }

  const token = await generateToken(user._id, user.username);

  res.cookie('auth.token', token, {
    httpOnly: true, // prevents JavaScript access to the cookie, mitigating XSS attacks
    secure: config.app.isProduction, // only set secure flag in production
    sameSite: 'strict', // prevents the cookie from being sent in cross-site requests, mitigating CSRF attacks
    maxAge: config.auth.cookieMaxAge, // sets the cookie to expire after the specified time
    path: '/', // ensures the cookie is sent with all requests to the domain
  });

  return res.status(200).json({ user, token: ' ' });
};

const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie('auth.token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Logout error',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).populate('followingCount followersCount');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export { register, login, logout, getMe };
