import { comparePassword } from '../../lib/utils/crypto.js';
import type { Request, Response } from 'express';
import User from './model.js';
import Follow from '../follows/model.js';

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

const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user._id;
    const following = await Follow.find({ follower: currentUserId }).select('following');
    const followingIds = following.map((f) => f.following);
    followingIds.push(currentUserId); // Exclude self as well

    const suggestedUsers = await User.find({ _id: { $nin: followingIds } })
      .select('-password')
      .limit(10);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(500).json({ error: error });
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

export { getUserProfile, getSuggestedUsers, updateUserProfile };
