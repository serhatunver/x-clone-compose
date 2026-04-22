import type { Request, Response, NextFunction } from 'express';
import { RESPONSE_KEYS } from '@repo/shared';
import { NotFoundError } from '#/lib/errors/index.js';
import { userRepository } from '#/modules/user/user.repository.js';

export const ensureTargetUserIsActive = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const userId = String(req.params.userId);
  const targetUser = await userRepository.findById(userId);

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!targetUser || targetUser.status !== 'active') {
    return next(new NotFoundError(RESPONSE_KEYS.ERROR.USER.USER_NOT_FOUND));
  }

  req.targetUser = targetUser;

  return next();
};
