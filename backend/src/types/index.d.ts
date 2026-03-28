import { IUser } from '#/modules/user/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user: Pick<IUser, '_id' | 'username'>;
      id: string;
      cookies: {
        'auth.token': string;
        [key: string]: string;
      };
    }
  }
}

export {};
