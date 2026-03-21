import { Types } from 'mongoose';
import { IUser } from '../users/model';

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
