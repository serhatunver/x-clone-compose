import { config } from '#/config/config.js';
import { comparePassword } from '../../lib/utils/crypto.js';
import User from '../users/model.js';
import type { Request, Response } from 'express';
import generateToken from '../../lib/utils/generateToken.js';

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

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
    const { username, password } = req.body;

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

    return res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login error',
      error: (error as Error).message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: config.app.isProduction,
      sameSite: 'strict',
      expires: new Date(0),
      maxAge: 0,
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
    // return res.status(200).json({
    //   userId: user._id,
    //   username: user.username,
    //   following: user.following,
    //   followers: user.followers,
    //   profileImg: user.profileImg,
    // });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export { register, login, logout, getMe };
