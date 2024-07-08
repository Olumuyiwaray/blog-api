import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import authMiddleware from '../../../middlewares/auth';
import { enviromentConfig } from '../../../config/envConfig';

jest.mock('../../../lib/utils', () => ({
  getEnvVariable: jest.fn(),
}));

jest.mock('../../../config/envConfig', () => ({
  enviromentConfig: {
    jwtSecret: 'mockedJwtSecret', // Mocked jwtSecret value
  },
}));

describe('auth middleware testing', () => {
  
  it('should set req.user with decoded payload when token is valid', () => {
    let req = {} as Request;
    req.headers = {
      authorization: 'Bearer validToken',
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    const jwtSecret = enviromentConfig.jwtSecret;
    
    const decodedPayload = {
      uID: '123',
      username: 'testUser',
    };
    const verifySpy = jest.spyOn(jwt, 'verify').mockImplementation(() => {
      try {
        req.user = {
          userId: decodedPayload.uID,
          username: decodedPayload.username,
        };
        next();
      } catch (error) {
        res.status(401).json({ message: 'Second Unauthorized', error: error });
      }
    });
    authMiddleware(req, res, next);
    expect(verifySpy).toHaveBeenCalledWith('validToken', jwtSecret);
    expect(req.user).toEqual({
      userId: '123',
      username: 'testUser',
    });
    expect(next).toHaveBeenCalled();
  });

  // returns 401 Unauthorized when token is missing
  it('should return 401 Unauthorized when token is missing', () => {
    let req = {} as Request;
    req.headers = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});
