import { Request, Response } from 'express';
import {
  changePassword,
  changeUsername,
  getUSer,
  logIn,
  logOut,
  register,
  resetPassword,
  sendResetLink,
  verifyRegisteredEmail,
  verifyResetLink,
} from '../../../controllers/user.controllers'; // Assuming you have a registerController file
import * as userService from '../../../services/user.service';

jest.mock('../../../services/user.service');
jest.mock('../../../lib/utils', () => ({
  generateToken: jest.fn(),
  constructEmail: jest.fn(),
  addJobToQueue: jest.fn(),
  getEnvVariable: jest.fn(),
  sendEmail: jest.fn(),
}));

describe('user controller', () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mock calls after each test
  });

  describe('Register Controller', () => {
    it('should register a new user', async () => {
      const result = 'Signup successfull';

      // Incoming user data
      const signupDetails = {
        name: 'Test User',
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      req.body = signupDetails;

      // Mock UserModel.create to resolve with the new user
      (userService.registerUser as jest.Mock).mockResolvedValue(result);

      await register(req, res, next);

      expect(userService.registerUser).toHaveBeenCalledWith(signupDetails, req);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const signupDetails = {
        name: 'Test User',
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'testpassword',
      };

      req.body = signupDetails;

      const mockError = new Error('Unable to create account try again later');

      (userService.registerUser as jest.Mock).mockRejectedValue(mockError);

      await register(req, res, next);

      expect(userService.registerUser).toHaveBeenCalledWith(signupDetails, req);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('verify email Controller', () => {
    it('verify user email', async () => {
      const result = 'verification successfull';

      req.params = {
        token: 'token',
      };

      (userService.verifyUserRegisterationEmail as jest.Mock).mockResolvedValue(
        result
      );

      await verifyRegisteredEmail(req, res, next);

      expect(userService.verifyUserRegisterationEmail).toHaveBeenCalledWith(
        req.params.token
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      req.params = {
        token: 'token',
      };

      const mockError = new Error('Unable to verify email try again later');

      (userService.verifyUserRegisterationEmail as jest.Mock).mockRejectedValue(
        mockError
      );

      await verifyRegisteredEmail(req, res, next);

      expect(userService.verifyUserRegisterationEmail).toHaveBeenCalledWith(
        req.params.token
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('login controller', () => {
    it('Should log user in successfully', async () => {
      const mockUser = {
        _id: 'validId',
        username: 'testuser',
        name: 'Test User',
        password: 'hashPassword',
        salt: 'randomSalt',
        profile_image: 'image.jpg',
        isVerified: true,
        verificationToken: '',
        verificationExpires: '2024-07-25T21:16:39.628Z',
        posts: [],
        resetPasswordToken: '',
        resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      };

      const loginDetails = {
        username: 'testuser',
        password: 'testpassword',
      };

      req.body = loginDetails;

      (userService.loginUser as jest.Mock).mockResolvedValue({
        token: 'mockToken',
        user: mockUser,
      });

      await logIn(req, res, next);

      expect(userService.loginUser).toHaveBeenCalledWith(loginDetails);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken',
        user: mockUser,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const loginDetails = {
        username: 'testuser',
        password: 'testpassword',
      };

      req.body = loginDetails;

      const mockError = new Error('Unable to login try again later');

      (userService.loginUser as jest.Mock).mockRejectedValue(mockError);

      await logIn(req, res, next);

      expect(userService.loginUser).toHaveBeenCalledWith(loginDetails);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('get user details', () => {
    it('Should return user details without password and hash', async () => {
      const mockUser = {
        _id: 'validId',
        username: 'testuser',
        name: 'Test User',
        password: '',
        salt: '',
        profile_image: 'image.jpg',
        isVerified: true,
        verificationToken: '',
        verificationExpires: '2024-07-25T21:16:39.628Z',
        posts: [],
        resetPasswordToken: '',
        resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      };

      req.user = {
        userId: 'validId',
        username: 'testuser',
      };

      (userService.getUserAccount as jest.Mock).mockResolvedValue(mockUser);

      await getUSer(req, res, next);

      expect(userService.getUserAccount).toHaveBeenCalledWith(req.user.userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      req.user = {
        userId: '123',
        username: 'testuser',
      };

      const mockError = new Error('Unable to get details try again later');

      (userService.getUserAccount as jest.Mock).mockRejectedValue(mockError);

      await getUSer(req, res, next);

      expect(userService.getUserAccount).toHaveBeenCalledWith(req.user.userId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Reset link', () => {
    it('Should send password reset link', async () => {
      const result = 'password reset link sent to email';
      const email = 'testuser@gmail.com';

      req.body = {
        email: 'testuser@gmail.com',
      };

      (userService.sendPasswordResetLink as jest.Mock).mockResolvedValue(
        result
      );

      await sendResetLink(req, res, next);

      expect(userService.sendPasswordResetLink).toHaveBeenCalledWith(
        email,
        req
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const email = 'testuser@gmail.com';

      req.body = {
        email: 'testuser@gmail.com',
      };

      const mockError = new Error('could not send link try again later');

      (userService.sendPasswordResetLink as jest.Mock).mockRejectedValue(
        mockError
      );

      await sendResetLink(req, res, next);

      expect(userService.sendPasswordResetLink).toHaveBeenCalledWith(
        email,
        req
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Verify reset link', () => {
    it('Should verify reset link', async () => {
      const token = 'mockToken';
      const result = token;

      req.params = {
        token,
      };

      (userService.verifyPasswordResetLink as jest.Mock).mockResolvedValue(
        result
      );

      await verifyResetLink(req, res, next);

      expect(userService.verifyPasswordResetLink).toHaveBeenCalledWith(token);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const token = 'mockToken';

      req.params = {
        token,
      };

      const mockError = new Error('unable to verify token try again later');

      (userService.verifyPasswordResetLink as jest.Mock).mockRejectedValue(
        mockError
      );

      await verifyResetLink(req, res, next);

      expect(userService.verifyPasswordResetLink).toHaveBeenCalledWith(token);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Reset password', () => {
    it('Should verify reset link', async () => {
      const token = 'mockToken';
      const password = 'new password';
      const result = 'Password reset successful';

      req.params = {
        token,
      };

      req.body = {
        password,
      };

      (userService.resetUserPassword as jest.Mock).mockResolvedValue(result);

      await resetPassword(req, res, next);

      expect(userService.resetUserPassword).toHaveBeenCalledWith(
        password,
        token
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const token = 'mockToken';
      const password = 'new password';

      req.params = {
        token,
      };

      req.body = {
        password,
      };

      const mockError = new Error('unable to reset password try again later');

      (userService.resetUserPassword as jest.Mock).mockRejectedValue(mockError);

      await resetPassword(req, res, next);

      expect(userService.resetUserPassword).toHaveBeenCalledWith(
        password,
        token
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Change user name', () => {
    it('Should change user username', async () => {
      const newUsername = 'new username';
      const result = 'Username updated successfully';

      req.user = {
        userId: '123',
        username: 'testuser',
      };

      req.body = {
        newUsername,
      };

      (userService.changeUserName as jest.Mock).mockResolvedValue(result);

      await changeUsername(req, res, next);

      expect(userService.changeUserName).toHaveBeenCalledWith(
        req.user.userId,
        newUsername
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const newUsername = 'new username';

      req.user = {
        userId: '123',
        username: 'testuser',
      };

      req.body = {
        newUsername,
      };

      const mockError = new Error('unable to change username try again later');

      (userService.changeUserName as jest.Mock).mockRejectedValue(mockError);

      await changeUsername(req, res, next);

      expect(userService.changeUserName).toHaveBeenCalledWith(
        req.user.userId,
        newUsername
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Change password', () => {
    it('Should change user password', async () => {
      const password = 'new password';
      const result = 'password updated successfully';

      req.user = {
        userId: '123',
        username: 'testuser',
      };

      req.body = {
        password,
      };

      (userService.changePassWord as jest.Mock).mockResolvedValue(result);

      await changePassword(req, res, next);

      expect(userService.changePassWord).toHaveBeenCalledWith(
        req.user.userId,
        password
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should call next for errors', async () => {
      const password = 'new password';

      req.user = {
        userId: '123',
        username: 'testuser',
      };

      req.body = {
        password,
      };

      const mockError = new Error('unable to change password try again later');

      (userService.changePassWord as jest.Mock).mockRejectedValue(mockError);

      await changePassword(req, res, next);

      expect(userService.changePassWord).toHaveBeenCalledWith(
        req.user.userId,
        password
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

  describe('Log out', () => {
    it('Should log user out', async () => {
      await logOut(req, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Log out successfull');
      expect(next).not.toHaveBeenCalled();
    });
  });
});
