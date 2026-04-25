import type { IUser } from '#/modules/user/user.model.js';

export interface AuthUser {
  _id: string;
  username: string;
  jti: string;
  exp: number;
  tokenVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      targetUser: IUser;
      requestId: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validated: any; // This will be typed more specifically in the route handlers using ValidatedRequest
      cookies?: {
        'auth.token'?: string;
        'auth.refresh_token'?: string;
        [key: string]: string;
      };
    }
  }
}

export {};
