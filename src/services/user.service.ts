import { Request } from 'express';
import { enviromentConfig } from '../config/envConfig';
import { ILogin, IRegister } from '../interfaces/auth';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../lib/customErrors';
import { constructEmail, generateToken } from '../lib/utils';
import { User } from '../models/User';
import { comparePassword, genSalt, hashPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email';
import addJobToQueue from '../config/queue';

export const registerUser = async (payload: IRegister, req: Request) => {
  const { name, username, email, password, profile_image } = payload;

  const checkEmail = await User.findOne({ email: { $eq: email } });

  if (checkEmail) {
    throw new ConflictError('Email already in use');
  }

  const checkUsername = await User.findOne({ username: { $eq: username } });

  if (checkUsername) {
    throw new ConflictError('username has been chosen');
  }

  const salt = await genSalt();
  const hash = await hashPassword(password, salt);
  const verificationToken = generateToken();

  // Add one month to the current date
  const now = new Date();
  const verificationExpires = new Date(now.setMonth(now.getMonth() + 1));

  const newUser = await User.create({
    name,
    username,
    email,
    password: hash,
    salt,
    profile_image,
    verificationToken,
    verificationExpires,
  });

  const verificationLink = `${req.protocol}://${req.hostname}:3000/users/verify/${verificationToken}`;
  const to = newUser.email;
  const subject = 'verify your email address';
  const label = 'Verify Email';
  const body = constructEmail(
    'Please click on the button below to verify your email',
    verificationLink,
    label
  );

  addJobToQueue({ to, subject, body });

  return 'Signup successfull';
};

export const verifyUserRegisterationEmail = async (token: string) => {
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw new UnauthorizedError('Invalid token');
  }

  if (user.verificationExpires < new Date(Date.now())) {
    throw new UnauthorizedError('Token expired');
  }

  user.isVerified = true;

  await user.save();

  return 'verification successfull';
};

export const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await User.findOne({ email: { $eq: email } });

  const jwtSecret = enviromentConfig.jwtSecret;

  if (!user) {
    throw new BadRequestError('Invalid username or password');
  }
  // check password validity
  const isPassword = await comparePassword(password, user.password, user.salt);

  // if Password is not valid send a response to the client
  if (!isPassword) {
    throw new BadRequestError('Invalid username or password');
  }

  // if password is valid create jwt token
  const token = jwt.sign({ uID: user._id, username: user.username }, jwtSecret);

  user.password = '';
  user.salt = '';

  return { token, user };
};

export const getUserAccount = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  user.password = '';
  user.salt = '';
  return user;
};

export const sendPasswordResetLink = async (email: string, req: Request) => {
  const user = await User.findOne({ email: { $eq: email } });

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  const token = generateToken();
  const verificationLink = `${req.protocol}://${req.hostname}:3000/users/verify/${token}`;
  const to = user.email;
  const subject = 'reset your password';
  const label = 'Reset password';
  const body = constructEmail(
    'Please click on the button to reset your password',
    verificationLink,
    label
  );
  await sendEmail({ to, subject, body });
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000);

  await user.save();
  return 'password reset link sent to email';
};

export const verifyPasswordResetLink = async (token: string) => {
  const user = await User.findOne({ resetPasswordToken: token });

  if (!user) {
    throw new UnauthorizedError('Invalid token');
  }

  if (user.resetPasswordExpires < new Date(Date.now())) {
    throw new UnauthorizedError('Expired token');
  }

  return token;
};

export const resetUserPassword = async (password: string, token: string) => {
  const user = await User.findOne({ resetPasswordToken: token });

  if (!user) {
    throw new UnauthorizedError('Invalid token');
  }

  const checkPassword = await comparePassword(
    password,
    user.password,
    user.salt
  );

  if (checkPassword) {
    throw new ConflictError('Cannot use your previous password');
  }

  const salt = await genSalt();
  const hash = await hashPassword(password, salt);

  user.password = hash;
  user.salt = salt;

  await user.save();

  return 'Password reset successful';
};

export const changeUserName = async (userId: string, newUsername: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.username === newUsername) {
    throw new ConflictError('Cannot use the same username as before');
  }

  user.username = newUsername;

  await user.save();

  return 'Username updated successfully';
};

export const changePassWord = async (userId: string, newPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  const checkPassword = await comparePassword(
    newPassword,
    user.password,
    user.salt
  );

  if (checkPassword) {
    throw new ConflictError('Cannot use your previous password');
  }

  const newSalt = await genSalt();
  const newHash = await hashPassword(newPassword, newSalt);

  user.salt = newSalt;
  user.password = newHash;

  await user.save();

  return 'password updated successfully';
};
