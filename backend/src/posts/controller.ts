import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from './model';
import type { IPost } from './model';
import User from '../users/model';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// createPost jsdoc
/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, image } = req.body;
    console.log('req.user:', req.user);
    console.log('req.body:', content, image);
    const userId: mongoose.Types.ObjectId = req.user._id;

    const post: IPost = await Post.create({ user: userId, content, image, isPost: true });

    if (post) {
      console.log('postController:', post);
      return res.status(201).json(post);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getPost = async (req: Request, res: Response) => {
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

    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error });
  }
};

// TODO
export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    // disable autopopulate
    const post = await Post.findById(postId, {}, { autopopulate: false });

    console.log(post);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(401).json({ error: 'You are not authorized to delete this post.' });
    }

    await Post.findByIdAndDelete(post._id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// TODO Should return only latest post (not comments) from following users
export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingPosts = await Post.find({ user: { $in: user.following } }, {}, { autopopulate: false })
      .sort({
        createdAt: -1,
      })
      .select('content')
      .limit(5);

    res.status(200).json(followingPosts);
  } catch (error) {
    res.status(500).json({ error: error });
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

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error });
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

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }, {}, { autopopulate: false })
    //   .populate({ path: 'user', select: 'username' })
    //   .sort({
    //     createdAt: -1,
    //   });

    res.status(200).json(user.likedPosts);
  } catch (error) {
    res.status(500).json({ error: error });
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

    console.log(posts);

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

export const likeUnlikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = user.likedPosts.includes(new mongoose.Types.ObjectId(postId));
    if (isLiked) {
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });

      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

      res.status(200).json({ message: 'Post liked successfully' });
    }
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

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
