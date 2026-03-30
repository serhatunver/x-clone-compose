import type { Request, Response } from 'express';
import type { IPost } from './post.model.js';
import mongoose from 'mongoose';
import Post from './post.model.js';
import User from '#/modules/user/user.model.js';
import Follow from '#/modules/follow/follow.model.js';
import type { GetPostInput } from './post.validation.js';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, image } = req.body;
    const userId: mongoose.Types.ObjectId = req.user._id;

    // 1. content or image is required to create a post
    if (!content && !image) {
      return res.status(400).json({ error: 'Content or image is required to create a post' });
    }

    // 2. content must be less than 280 characters
    if (content && content.length > 280) {
      return res.status(400).json({ error: 'Text must be less than 280 characters' });
    }

    const post: IPost = await Post.create({ user: userId, content, image, isPost: true });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getPost = async (
  req: Request<GetPostInput, Record<string, never>, Record<string, never>>,
  res: Response,
) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
      path: 'comments',
      // select: 'content',
      options: { autopopulate: false },
      populate: { path: 'user', select: 'username profileImg' },
    });
    // .select('-likes -reposts');

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: ReasonPhrases.NOT_FOUND,
      });
    }

    return res.status(StatusCodes.OK).json(post);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: (error as Error).message || 'Internal server error',
    });
  }
};

// TODO
export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    // disable autopopulate
    const post = await Post.findById(postId, {}, { autopopulate: false });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(401).json({ error: 'You are not authorized to delete this post.' });
    }

    await Post.findByIdAndDelete(post._id);

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const following = await Follow.find({ follower: userId }).select('following');
    const followingIds = following.map((f) => f.following);

    const posts = await Post.find({ user: { $in: followingIds } }, {}, { autopopulate: false })
      .populate({ path: 'user', select: 'username profileImg' })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({}, {}, { autopopulate: false })
      .populate({
        path: 'user',
        select: 'username profileImg',
      })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getUserLikedPosts = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username }).populate({
      path: 'likedPosts',
      options: { autopopulate: false },
      populate: { path: 'user', select: 'username' },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }, {}, { autopopulate: false })
    //   .populate({ path: 'user', select: 'username' })
    //   .sort({
    //     createdAt: -1,
    //   });

    return res.status(200).json(user.likedPosts);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    const userId = await User.findOne({ username }).select('_id');

    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).populate({
      path: 'user',
      select: '-password',
    });

    // const posts = await User.findOne({ username })
    //   .select('-password')
    //   .populate({
    //     path: 'posts',
    //     select: 'content user likes reposts comments createdAt',
    //     options: { sort: { createdAt: -1 } },
    //   })
    //   .populate('totalPosts');

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const commentOnPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const userId = req.user._id;

    const comment = await Post.create({ user: userId, content, replyTo: postId, isPost: false });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res.status(200).json({ comment });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
