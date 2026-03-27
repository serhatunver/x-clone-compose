import type { Request, Response } from 'express';
import { config } from '#/config/config.js';
import { comparePassword } from '#/lib/utils/crypto.js';
import User from '#/modules/user/user.model.js';
import generateToken from '#/lib/utils/generateToken.js';

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password less than 6 characters' });
    }
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

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
        likedPosts: user.likedPosts,
      });
    } else {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    return res.status(401).json({
      message: 'User not created',
      error: (error as Error).message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
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
  } catch (error) {
    return res.status(500).json({
      message: 'Login error',
      error: (error as Error).message,
    });
  }
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
