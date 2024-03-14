import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { inspect } from 'util';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { iGetUser, jwtPayLoad } from '..';



// Create middleware to log and handle errors
export const errorMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {

    logger.error(`${err.name || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // Log the error
  console.error(err);

  // Default error status code and message
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  // Handle specific error types
  if (err instanceof SyntaxError || err instanceof TypeError) {
    // Handle invalid input issues (e.g., JSON parsing error)
    statusCode = 400;
    errorMessage = 'Bad Request';
  }  else if (err.name === 'NetworkError') {
    // Handle network issues (e.g., failed network request)
    statusCode = 503;
    errorMessage = 'Service Unavailable';
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      // Optionally include stack trace in development environment
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}


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
  logger.info(`${method} ${url}, ${headers['user-agent']}, ${inspect(wantedPayload, false, null, false)}, ${ip}`);
  
  next();
};

// Create response middleware to log response
export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  // Store original res.send to log the response status
  const { sendStatus, status, statusCode, statusMessage} = res;
  logger.info(`${statusCode}`);
  next();
} 


export const AuthMiddleware = (req: iGetUser, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const jwtSecret = process.env.JWT_SECRET!;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayLoad;
    req.userId = decoded.uID;
    console.log(req.userId);
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}