import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { jwtPayLoad } from '../interfaces/interface';
import enviromentConfig from '../config/envConfig';
import { User } from '../models/user';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  const jwtSecret = enviromentConfig.jwtSecret;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, Token not found' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayLoad;
    req.user = {
      userId: decoded.uID,
      username: decoded.username,
    };

    const userObj = await User.findById(req.user.userId);

    if (!userObj) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    if (userObj.status !== 'Active') {
      return res.status(401).json({
        message:
          'Unauthorized, user not account not active please contact Admin',
      });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Second Unauthorized', error: error });
  }
};

export default authMiddleware;
