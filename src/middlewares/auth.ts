import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { jwtPayLoad } from '../interfaces/interface';
import { enviromentConfig } from '../config/envConfig';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  const jwtSecret = enviromentConfig.jwtSecret;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayLoad;
    req.user = {
      userId: decoded.uID,
      username: decoded.username,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Second Unauthorized', error: error });
  }
};

export default authMiddleware;
