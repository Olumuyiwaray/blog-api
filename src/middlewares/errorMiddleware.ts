import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { DatabaseError, DuplicateError, NotFoundError } from '../utils/CustomError';

// Create middleware to log and handle errors
const errorMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    `${err.name || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  // Log the error
  console.error(err);

  // Default error status code and message
  let statusCode: number = 500;
  let errorMessage: string = 'Internal Server Error';

  if (err instanceof NotFoundError) {
    // Handle network issues (e.g., failed network request)
    statusCode = 401;
    errorMessage = err.message;
  }

  if (err instanceof DatabaseError) {
    // Handle network issues (e.g., failed network request)
    statusCode = 500;
    errorMessage = err.message;
  }
  
  if (err instanceof DuplicateError) {
    // Handle network issues (e.g., failed network request)
    statusCode = 500;
    errorMessage = err.message;
  }
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
