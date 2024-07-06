import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../lib/customErrors';

const errorMiddleWare = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Send error to error log
  logger.error(
    `${error.name || 500} - ${error.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );

  const errorMap = new Map([
    [NotFoundError, { statusCode: 404, message: error.message }],
    [UnauthorizedError, { statusCode: 401, message: error.message }],
    [BadRequestError, { statusCode: 400, message: error.message }],
    [ConflictError, { statusCode: 409, message: error.message }],
  ]);

  // Default error status code and message
  let statusCode: number = 500;
  let errorMessage: string = 'Internal Server Error';

  for (const [ErrorType, errorInfo] of errorMap) {
    if (error instanceof ErrorType) {
      statusCode = errorInfo.statusCode;
      errorMessage = errorInfo.message;
      break;
    }
  }

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      // Optionally include stack trace in development environment
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};

export default errorMiddleWare;
