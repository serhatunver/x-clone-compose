import User from '../users/model';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import generateTokenAndSetCookie from '../lib/utils/generateToken';

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  // validate email here
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

  // hash password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      await generateTokenAndSetCookie(user?._id, res);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
        likedPosts: user.likedPosts,
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(401).json({
      message: 'User not created',
      error: (error as Error).message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Check if username and password is provided
  if (!username || !password) {
    console.log('Username or Password not present');
    return res.status(400).json({
      message: 'Username or Password not present',
    });
  }
  console.log('Username and Password already present');
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'user not found' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = await generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
        likedPosts: user.likedPosts,
      },
      token: token,
    });
  } catch (error) {
    res.status(401).json({
      message: 'User not logged in',
      error: (error as Error).message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json('logout successfully');
  } catch (error) {
    res.status(500).json({
      message: 'Logout error',
      error: error,
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    // console.log('req.user._id', req.user._id);
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // console.log('session', user);
    res.status(200).json({
      userId: user._id,
      username: user.username,
      following: user.following,
      followers: user.followers,
      profileImg: user.profileImg,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export { register, login, logout, getMe };
