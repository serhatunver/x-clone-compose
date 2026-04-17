import type { Request, Response } from 'express';
import { userService } from './user.service.js';
import type { GetProfileParams, UpdateProfileInput } from '@repo/shared';

export const getProfile = async (req: Request<GetProfileParams>, res: Response) => {
  const { username } = req.params;
  const currentUserId = req.user._id;

  const profile = await userService.getProfile(username, currentUserId);
  return res.status(200).json(profile);
};

export const updateProfile = async (
  req: Request<Record<string, never>, Record<string, never>, UpdateProfileInput>,
  res: Response,
) => {
  const userId = req.user._id;
  const updatedUser = await userService.updateProfile(userId, req.body);

  return res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
};
