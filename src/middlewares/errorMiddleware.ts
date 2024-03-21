import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { Error } from 'mongoose';

// Create middleware to log and handle errors
const errorMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Send error to error log
  logger.error(
    `${err.name || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  // Default error status code and message
  let statusCode: number = 500;
  let errorMessage: string = 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      // Optionally include stack trace in development environment
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export default errorMiddleWare;
