import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import User, { type IUser } from './model';
import Notification from '../notifications/model';

/**
 * @swagger
 * user/profile/{username}:
 *   get:
 *     summary: Get user profile
 *     description: Get user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 description:
 *               name:
 *                 type: string
 *                 description:
 *     parameters:
 *       in: path
 *       name: username
 *       schema:
 *         type: string
 *       required: true
 *     example: 'john_doe'
 *     responses:
 *       200:
 *         description: User profile
 *       500:
 *         description: Internal server error
 */
const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

/**
 * @swagger
 * /items:
 *   post:
 *     summary:
 *     description:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 description:
 *               name:
 *                 type: string
 *                 description:
 *     responses:
 *       201:
 *         description:
 *       400:
 *         description:
 *       500:
 *         description:
 */
const followUnfollowUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newId = new mongoose.Types.ObjectId(id);

    // if (newId.equals(req.user._id)) {
    // if (id === req.user._id.toString()) {
    if (req.user._id.equals(id)) {
      return res.status(400).json({ error: "You can't follow/unfollow yourself" });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(newId);
    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      // follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      await Notification.create({
        from: currentUser._id,
        to: userToModify._id,
        type: 'follow',
      });

      // TODO return the id of the user as a response
      res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select('following');
    if (!usersFollowedByMe) {
      return res.status(404);
    }

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    // TODO
    const followedUserIds = usersFollowedByMe.following.map((userId: mongoose.Types.ObjectId) => userId.toString());
    const filteredUsers = users.filter((user: IUser) => !followedUserIds.includes(user._id.toString()));
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user: IUser) => (user.password = ''));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(400);
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  const { email, username, currentPassword, newPassword, bio, link } = req.body;
  const { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'user not found' });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
      // if (!newPassword || !currentPassword) {
      return res.status(400).json({ message: 'please provie both current and new password' });
    }

    if (newPassword && currentPassword && newPassword !== currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    //TODO cloudinary
    if (profileImg) {
      //
    }
    if (coverImg) {
      //
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    user.password = '';

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUserProfile };
