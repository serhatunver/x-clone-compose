import { IUser } from '#/modules/user/user.model.js';
import { Types } from 'mongoose';
declare global {
  namespace Express {
    interface Request {
      user: Pick<IUser, 'username'> & { _id: Types.ObjectId };
      id: string;
      cookies?: {
        'auth.token'?: string;
        [key: string]: string;
      };
    }
  }
}

export {};
