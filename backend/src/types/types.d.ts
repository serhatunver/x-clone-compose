import { Types } from 'mongoose';
import { IUser } from '#/modules/user/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user: Pick<IUser, '_id' | 'username'>;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: Types.ObjectId;
    username: string;
  }
}

export {};
