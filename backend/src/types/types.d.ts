import { IUser } from '../users/model';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}

export {};
