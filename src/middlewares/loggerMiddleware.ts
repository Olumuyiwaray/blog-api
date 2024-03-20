import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { inspect } from 'util';

// Create an Express middleware function to log requests
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url, headers, body, ip } = req;
  const { password } = body;
  let wantedPayload = body;
  if (password) {
    const { password, ...otherBody } = body;
    wantedPayload = otherBody;
  }
  logger.info(
    `${method} ${url}, ${headers['user-agent']}, ${inspect(
      wantedPayload,
      false,
      null,
      false
    )}, ${ip}`
  );

  next();
};

// Create response middleware to log response
export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Store original res.send to log the response status
  const { sendStatus, status, statusCode, statusMessage } = res;
  logger.info(`${statusCode}`);
  next();
};
