import morgan from 'morgan';
import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Morgan logging middleware for request and response
  morgan('combined', { stream: morganStream })(req, res, () => {});

  // Custom request logging
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);

  logger.info(`${res.statusCode}, ${res.statusMessage}`);

  next();
};

export default loggerMiddleware;