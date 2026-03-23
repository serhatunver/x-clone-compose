import type { Request, Response } from 'express';
import Follow from './follow.model.js';
import User from '#/modules/user/user.model.js';
// import Notification from '../notifications/model.js';

export const toggleFollow = async (req: Request, res: Response) => {
  try {
    const { id: userToModifyId } = req.params; // Person to follow/unfollow
    const currentUserId = req.user._id; // Person who is following/unfollowing

    if (userToModifyId === currentUserId.toString()) {
      return res.status(400).json({ error: 'You cannot follow/unfollow yourself' });
    }

    const userToModify = await User.findById(userToModifyId);
    if (!userToModify) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the follow relationship already exists
    const isFollowing = await Follow.findOne({
      follower: currentUserId,
      following: userToModifyId,
    });

    if (isFollowing) {
      // UNFOLLOW: Delete the relationship
      await Follow.findByIdAndDelete(isFollowing._id);
      return res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      // FOLLOW: Create a new relationship
      await Follow.create({
        follower: currentUserId,
        following: userToModifyId,
      });

      // TODO: Send notification here (Notification.create)
      // await Notification.create({
      //   from: currentUserId,
      //   to: userToModifyId,
      //   type: 'follow',
      // });

      return res.status(200).json({ message: 'Followed successfully' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};
