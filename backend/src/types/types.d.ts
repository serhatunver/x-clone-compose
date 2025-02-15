import { IUser } from '../users/model';

//TODO causes error in users/routes.ts/ protectRoute
// declare module 'Express' {
//   export interface Request {
//     user: IUser;
//   }
// }

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
  }
}
declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}

// interface MyUserRequest extends Request {
//   user: IUser;
// }

// export default MyUserRequest;
