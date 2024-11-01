import { Request } from 'express';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../utils/customErrors';
import { User } from '../../../models/user';
import jwt from 'jsonwebtoken';
import userService from '../../../services/user.service';
import {
  comparePassword,
  genSalt,
  hashPassword,
} from '../../../utils/password';
import { generateToken, getEnvVariable } from '../../../lib/utils';
import addJobToQueue from '../../../config/queue';

// Mock external dependencies
jest.mock('../../../utils/password', () => ({
  genSalt: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock('../../../config/queue', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../lib/utils', () => ({
  generateToken: jest.fn(),
  constructEmail: jest.fn(),
  getEnvVariable: jest.fn(),
}));

jest.mock('../../../utils/email', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('../../../models/User'); // Mock the User model

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('create a new account service', () => {
  let req: Request;
  beforeEach(() => {
    jest.clearAllMocks();
    req = {} as Request;
  });

  it('should create a user', async () => {
    // Returned saved user
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    // Incoming user data
    const userSignupDetails = {
      name: 'Test User',
      username: 'testuser',
      email: 'email@maiil.com',
      password: 'testpassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
    (generateToken as jest.Mock).mockResolvedValue('token');
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    // (addJobToQueue as jest.Mock).mockImplementation(() => undefined);

    const result = await userService.registerUser(userSignupDetails, req);

    expect(User.findOne).toHaveBeenCalled();
    expect(genSalt).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
    expect(generateToken).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(typeof result).toBe('string');
  });

  it('should throw an email already in use conflict error if user found', async () => {
    // Returned saved user
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    // Incoming user data
    const userSignupDetails = {
      name: 'Test User',
      username: 'testuser',
      email: 'email@maiil.com',
      password: 'testpassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
    (generateToken as jest.Mock).mockResolvedValue('token');
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    // (addJobToQueue as jest.Mock).mockImplementation()

    await expect(
      userService.registerUser(userSignupDetails, req)
    ).rejects.toThrow(ConflictError);
    await expect(
      userService.registerUser(userSignupDetails, req)
    ).rejects.toThrow('Email already in use');
    expect(User.findOne).toHaveBeenCalled();
    expect(genSalt).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
  });
});

describe('verify registered email service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify user email', async () => {
    // Returned saved user
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: false,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const verificationToken = 'verificationToken';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.verifyRegisterationEmail(
      verificationToken
    );

    expect(User.findOne).toHaveBeenCalledWith({ verificationToken });
    expect(mockUser.save).toHaveBeenCalled();
    expect(typeof result).toBe('string');
  });

  it('should throw an invalid token error if user found', async () => {
    // Returned saved user
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const verificationToken = 'verificationToken';

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      userService.verifyRegisterationEmail(verificationToken)
    ).rejects.toThrow(UnauthorizedError);
    await expect(
      userService.verifyRegisterationEmail(verificationToken)
    ).rejects.toThrow('Invalid token');
    expect(User.findOne).toHaveBeenCalledWith({ verificationToken });
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});

describe('login service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a user', async () => {
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

    const payload = {
      email: 'useremail@gmail.com',
      password: 'password',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    const result = await userService.loginUser(payload);

    expect(User.findOne).toHaveBeenCalledWith({
      email: { $eq: payload.email },
    });
    expect(comparePassword).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual({ token: 'mockToken', user: mockUser });
  });

  it('should throw a bad request error if user not found by email', async () => {
    const payload = {
      email: 'useremail@gmail.com',
      password: 'password',
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    await expect(userService.loginUser(payload)).rejects.toThrow(
      BadRequestError
    );
    await expect(userService.loginUser(payload)).rejects.toThrow(
      'Invalid username or password'
    );
    expect(User.findOne).toHaveBeenCalledWith({
      email: { $eq: payload.email },
    });
    expect(comparePassword).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should throw a bad request error if user password not correct', async () => {
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

    const payload = {
      email: 'useremail@gmail.com',
      password: 'password',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    await expect(userService.loginUser(payload)).rejects.toThrow(
      BadRequestError
    );
    await expect(userService.loginUser(payload)).rejects.toThrow(
      'Invalid username or password'
    );
    expect(User.findOne).toHaveBeenCalledWith({
      email: { $eq: payload.email },
    });
    expect(comparePassword).toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});

describe('get user account details service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get user account', async () => {
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

    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const userId = 'validId';
    const result = await userService.getUserById(userId);

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockUser);
  });

  it('Should throw an error if user is not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const userId = 'invalidId';

    await expect(userService.getUserById(userId)).rejects.toThrow(
      NotFoundError
    );
    await expect(userService.getUserById(userId)).rejects.toThrow(
      'user not found'
    );
    expect(User.findById).toHaveBeenCalledWith(userId);
  });
});

describe('send password reset link service', () => {
  let req: Request;
  beforeEach(() => {
    jest.clearAllMocks();
    req = {} as Request;
  });

  it('should send password reset link', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };
    const email = 'useremail@gmail.com';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (generateToken as jest.Mock).mockResolvedValue('token');

    const result = await userService.sendPasswordResetCode(email, req);

    expect(User.findOne).toHaveBeenCalledWith({
      email: { $eq: email },
    });
    expect(typeof result).toBe('string');
  });

  it('should return an error when user not found ', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: '',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };
    const email = 'useremail@gmail.com';

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (generateToken as jest.Mock).mockResolvedValue('token');

    await expect(userService.sendPasswordResetCode(email, req)).rejects.toThrow(
      NotFoundError
    );
    await expect(userService.sendPasswordResetCode(email, req)).rejects.toThrow(
      'User does not exist'
    );
    expect(User.findOne).toHaveBeenCalledWith({ email: { $eq: email } });
    expect(generateToken).not.toHaveBeenCalled();
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});

describe('verify password reset link service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify reset link', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
    };

    const token = 'resetToken';
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.verifyPasswordResetCode(token);

    expect(User.findOne).toHaveBeenCalledWith({ resetPasswordToken: token });
    expect(typeof result).toBe('string');
  });

  it('should throw an error if user not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const token = 'resetToken';

    await expect(userService.verifyPasswordResetCode(token)).rejects.toThrow(
      UnauthorizedError
    );
    await expect(userService.verifyPasswordResetCode(token)).rejects.toThrow(
      'Invalid token'
    );
    expect(User.findOne).toHaveBeenCalledWith({ resetPasswordToken: token });
  });
});

describe('reset password service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset user password', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const password = 'hashPassword';
    const token = 'resetToken';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    const result = await userService.resetPassword(password, token);

    expect(User.findOne).toHaveBeenCalledWith({ resetPasswordToken: token });
    expect(comparePassword).toHaveBeenCalled();
    expect(genSalt).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(typeof result).toBe('string');
  });

  it('should return error if user not found', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const password = 'hashPassword';
    const token = 'resetToken';

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    await expect(userService.resetPassword(password, token)).rejects.toThrow(
      UnauthorizedError
    );
    await expect(userService.resetPassword(password, token)).rejects.toThrow(
      'Invalid token'
    );
    expect(User.findOne).toHaveBeenCalledWith({ resetPasswordToken: token });
    expect(comparePassword).not.toHaveBeenCalled();
    expect(genSalt).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it('should return error password is the same as previous password', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const password = 'hashPassword';
    const token = 'resetToken';

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    await expect(userService.resetPassword(password, token)).rejects.toThrow(
      ConflictError
    );
    await expect(userService.resetPassword(password, token)).rejects.toThrow(
      'Cannot use your previous password'
    );
    expect(User.findOne).toHaveBeenCalledWith({ resetPasswordToken: token });
    expect(comparePassword).toHaveBeenCalled();
    expect(genSalt).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});

describe('change username service', () => {
  /**
   * still need to check if previous username === new user name
   */

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should chage username', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const userId = 'validId';
    const newUsername = 'newUsername';

    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.changeUsername(userId, newUsername);

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(mockUser.save).toHaveBeenCalled();
    expect(typeof result).toBe('string');
  });

  it('should throw an error if user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const userId = 'invalidId';
    const newUsername = 'newUsername';

    await expect(
      userService.changeUsername(userId, newUsername)
    ).rejects.toThrow(NotFoundError);
    await expect(
      userService.changeUsername(userId, newUsername)
    ).rejects.toThrow('User not found');
    expect(User.findById).toHaveBeenCalledWith(userId);
  });
});

describe('change password service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change user password', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const userId = 'validId';
    const newPassword = 'newPassword';

    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    const result = await userService.changePassword(userId, newPassword);

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(comparePassword).toHaveBeenCalled();
    expect(genSalt).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(typeof result).toBe('string');
  });

  it('should throw an error if user not found', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const userId = 'validId';
    const newPassword = 'newPassword';

    (User.findById as jest.Mock).mockResolvedValue(null);
    (comparePassword as jest.Mock).mockResolvedValue(false);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    await expect(
      userService.changePassword(userId, newPassword)
    ).rejects.toThrow(NotFoundError);
    await expect(
      userService.changePassword(userId, newPassword)
    ).rejects.toThrow('user not found');
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(comparePassword).not.toHaveBeenCalled();
    expect(genSalt).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(mockUser.save).not.toHaveBeenCalled();
  });

  it('should return error password is the same as previous password', async () => {
    const mockUser = {
      _id: 'validId',
      name: 'Test User',
      username: 'testuser',
      email: 'useremail@gmail.com',
      password: 'hashPassword',
      salt: 'randomSalt',
      profile_image: 'image.jpg',
      isVerified: true,
      verificationToken: '',
      verificationExpires: '2024-07-25T21:16:39.628Z',
      posts: [],
      resetPasswordToken: 'resetToken',
      resetPasswordExpires: '2024-07-25T21:16:39.628Z',
      save: jest.fn().mockReturnThis(),
    };

    const userId = 'validId';
    const newPassword = 'newPassword';

    (User.findById as jest.Mock).mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (genSalt as jest.Mock).mockResolvedValue('randomSalt');
    (hashPassword as jest.Mock).mockResolvedValue('hashPassword');

    await expect(
      userService.changePassword(userId, newPassword)
    ).rejects.toThrow(ConflictError);
    await expect(
      userService.changePassword(userId, newPassword)
    ).rejects.toThrow('Cannot use your previous password');
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(comparePassword).toHaveBeenCalled();
    expect(genSalt).not.toHaveBeenCalled();
    expect(hashPassword).not.toHaveBeenCalled();
    expect(mockUser.save).not.toHaveBeenCalled();
  });
});
