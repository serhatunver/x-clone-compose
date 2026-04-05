import crypto from 'node:crypto';
import { authRepository } from './auth.repository.js';
import { comparePassword } from '#/lib/utils/crypto.js';
import generateToken from '#/lib/utils/generateToken.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '#/lib/utils/error.handler.js';
import type { RegisterInput, LoginInput } from './auth.validation.js';

export const authService = {
  async register(data: RegisterInput) {
    const [existingUser, existingEmail] = await Promise.all([
      authRepository.findByUsername(data.username),
      authRepository.findByEmail(data.email),
    ]);

    if (existingUser) throw new ConflictError('Username already exists');
    if (existingEmail) throw new ConflictError('Email already exists');

    return authRepository.createUser(data);
  },

  async login(data: LoginInput) {
    const user = await authRepository.findByIdentifier(data.identifier);

    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = await generateToken(
      user._id,
      user.username,
      // user.tokenVersion
    );
    return { user, token };
  },

  async getMe(userId: string) {
    const user = await authRepository.findByIdWithCounts(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  async forgotPassword(email: string): Promise<{ message: string; debugToken?: string }> {
    const user = await authRepository.findByEmail(email);

    // Security: Generic message
    const genericResponse = {
      message: 'If an account exists with this email, a reset link has been sent',
    };
    if (!user) return genericResponse;

    // Cooldown Check: 5 Minutes
    const COOLDOWN_TIME = 5 * 60 * 1000;
    if (
      user.passwordResetLastSentAt &&
      Date.now() - user.passwordResetLastSentAt.getTime() < COOLDOWN_TIME
    ) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await authRepository.setResetToken(user._id.toString(), {
      hashedToken,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins validity
      lastSent: new Date(),
    });

    // sendResetEmail(user.email, resetToken); // Implement email sending logic
    return { ...genericResponse, debugToken: resetToken };
  },

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await authRepository.findByValidResetToken(hashedToken);
    if (!user) throw new BadRequestError('Token is invalid or has expired');

    // Update password and clear reset fields
    user.password = password;

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // TODO Invalidate existing tokens by incrementing tokenVersion
    // user.tokenVersion = (user.tokenVersion || 0) + 1;

    // Save triggers the 'pre-save' hook to hash the new password
    await user.save();

    return { message: 'Password reset successful' };
  },
};
