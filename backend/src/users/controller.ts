import { comparePassword } from '../lib/utils/crypto.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import User, { type IUser } from './model.js';
import Notification from '../notifications/model.js';

const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

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
      return res.status(200).json({ message: 'User unfollowed successfully' });
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
      return res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
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
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(400);
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  const { email, username, currentPassword, newPassword, bio, link } = req.body;
  const { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    // Need to explicitly select +password since it's hidden by default in the model
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Password update logic
    if (newPassword && currentPassword) {
      if (!newPassword || !currentPassword) {
        return res.status(400).json({ message: 'Please provide both current and new password' });
      }

      // Verify existing password
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

      if (newPassword === currentPassword) {
        return res.status(400).json({ message: 'New password cannot be the same as old' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // Assign plain password; the pre-save hook in the model will handle hashing automatically
      user.password = newPassword;
    }

    //TODO cloudinary
    if (profileImg) {
      //
    }
    if (coverImg) {
      //
    }

    // 2. Update other profile fields
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    // 3. Save changes (triggers pre-save hook to hash password if it was changed)
    await user.save();

    // 4. Return updated user profile (excluding password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUserProfile };
