import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { jwtPayLoad } from '../global';

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  const jwtSecret = process.env.JWT_SECRET!;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayLoad;
    //console.log(decoded);
    req.user = {
      userId: decoded.uID,
      username: decoded.username
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Second Unauthorized', error: error });
  }
};

export default AuthMiddleware;
