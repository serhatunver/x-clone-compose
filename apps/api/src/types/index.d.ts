export interface AuthUser {
  _id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      requestId: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validated: any; // This will be typed more specifically in the route handlers using ValidatedRequest
      cookies?: {
        'auth.token'?: string;
        [key: string]: string;
      };
    }
  }
}

export {};
