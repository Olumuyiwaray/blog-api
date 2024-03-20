import { Request } from 'express';
import { User } from './models/User';

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        username: string;
      };
    }
  }
}

interface jwtPayLoad {
  uID: string;
  username: string;
}
