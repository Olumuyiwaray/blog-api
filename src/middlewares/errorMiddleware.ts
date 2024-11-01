import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import * as errors from '../utils/customErrors';

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
    [errors.NotFoundError, { statusCode: 404, message: error.message }],
    [errors.UnauthorizedError, { statusCode: 401, message: error.message }],
    [errors.BadRequestError, { statusCode: 400, message: error.message }],
    [errors.ConflictError, { statusCode: 409, message: error.message }],
  ]);

  // Default error status code and message
  const responseObj = {
    isSuccess: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
  let statusCode: number = 500;
  // let errorMessage: string = 'Internal Server Error';

  for (const [ErrorType, errorInfo] of errorMap) {
    if (error instanceof ErrorType) {
      statusCode = errorInfo.statusCode;
      responseObj.message = errorInfo.message;
      break;
    }
  }

  res.status(statusCode).json(responseObj);
};

export default errorMiddleWare;
