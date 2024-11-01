import { Request } from 'express';
import enviromentConfig from '../config/envConfig';
import { ILogin, IRegister } from '../interfaces/auth';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/customErrors';
import { generateCode, generateToken } from '../lib/utils';
import { User } from '../models/user';
import { comparePassword, genSalt, hashPassword } from '../utils/password';
import jwt from 'jsonwebtoken';
import addJobToQueue from '../config/queue';
import {
  forgotPasswordEmailBody,
  registerEmailBody,
} from '../utils/emailtemplates';
import VerificationToken from '../models/verificationtoken';
import ResetCode from '../models/resetcode';
import { sendEmail } from '../utils/email';
import Role from '../models/roles';
import AppRole from '../models/approle';

const registerUser = async (payload: IRegister, req: Request) => {
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

  const newUser = await User.create({
    name,
    username,
    email,
    password: hash,
    salt,
    profile_image,
  });

  if (!newUser) {
    throw new Error('Unable to create user please try again later');
  }

  const role = await Role.findOne({ name: 'User' });

  if (!role) {
    throw new NotFoundError('role not found');
  }

  await AppRole.create({
    user_id: newUser.id,
    role_id: role.id,
    created_by: newUser.id,
  });

  const now = new Date();
  const verificationExpires = new Date(
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 15
  );

  const verificationToken = generateToken();
  const verificationLink = `${req.protocol}://${req.hostname}:3000/users/verify/${verificationToken}`;

  // const to = newUser.email;
  // const subject = 'verify your email address';
  const emailBody = registerEmailBody;

  emailBody.replace('{{name}}', newUser.name);
  emailBody.replace('{{verificationurl}}', verificationLink);
  emailBody.replace(
    '{{expirydatetime}}',
    new Date(verificationExpires).toLocaleTimeString
  );

  const emailObj = {
    to: newUser.email,
    subject: 'verify your email address',
    body: emailBody,
  };

  await VerificationToken.create({
    token: verificationToken,
    user_id: newUser.id,
    expires_at: verificationExpires,
  });

  addJobToQueue(emailObj);

  return 'Signup successfull';
};

/**
 *
 * @param email
 * TODO: Implement resend token
 */

const resendRegisterationToken = async (email: string) => {};

const verifyRegisterationEmail = async (token: string) => {
  const tokenObj = await VerificationToken.findOne({ token: token });

  if (!tokenObj) {
    throw new UnauthorizedError('Invalid token');
  }

  if (tokenObj.expires_at < new Date(Date.now())) {
    throw new UnauthorizedError('Token expired');
  }

  const user = await User.findById(tokenObj.user_id);

  if (!user) {
    throw new NotFoundError('Token expired');
  }

  const userRole = await AppRole.findOne({ user_id: user.id });

  if (!userRole) {
    throw new NotFoundError('User not found please contact admin');
  }

  userRole.is_active = true;
  user.status = 'Active';
  tokenObj.is_confirmed = true;

  await Promise.all([]);
  await user.save();
  await tokenObj.save();

  return 'verification successfull';
};

export const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await User.findOne({ email: { $eq: email } });

  const jwtSecret = enviromentConfig.jwtSecret;

  if (!user) {
    throw new BadRequestError('Invalid username or password');
  }

  const isPassword = await comparePassword(password, user.password, user.salt);

  if (!isPassword) {
    throw new BadRequestError('Invalid username or password');
  }

  const token = jwt.sign(
    { uID: user._id, username: user.username },
    jwtSecret,
    {
      expiresIn: '1d',
    }
  );

  user.password = '';
  user.salt = '';

  return { token, user };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError('user not found');
  }

  user.password = '';
  user.salt = '';
  return user;
};

const sendPasswordResetCode = async (email: string, req: Request) => {
  const user = await User.findOne({ email: { $eq: email } });

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  const resetCode = generateCode();

  const now = new Date();
  const resetCodeExpires = new Date(
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 10
  );

  const emailBody = forgotPasswordEmailBody;

  emailBody.replace('{{name}}', user.name);
  emailBody.replace('{{code}}', resetCode);
  emailBody.replace(
    '{{expirydatetime}}',
    new Date(resetCodeExpires).toLocaleDateString
  );
  const emailObj = {
    to: user.email,
    subject: 'Password Reset',
    body: emailBody,
  };

  await sendEmail(emailObj);

  await ResetCode.create({
    code: resetCode,
    user_id: user.id,
    expires_at: resetCodeExpires,
  });
  return 'password reset link sent to email';
};

/**
 *
 * @param
 * TODO: Implement resend code
 */

const verifyPasswordResetCode = async (code: string) => {
  const resetCode = await ResetCode.findOne({ code: code });

  if (!resetCode) {
    throw new UnauthorizedError('Invalid token');
  }

  if (resetCode.expires_at < new Date(Date.now())) {
    throw new UnauthorizedError('Expired token');
  }

  return code;
};

const resetPassword = async (password: string, code: string) => {
  const resetCode = await ResetCode.findOne({ code: code });

  const user = await User.findById(resetCode?.user_id);
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

  const newSalt = await genSalt();
  const newHash = await hashPassword(password, newSalt);

  user.password = newHash;
  user.salt = newSalt;

  await user.save();

  return 'Password reset successful';
};

const changeUsername = async (userId: string, newUsername: string) => {
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

const changePassword = async (userId: string, newPassword: string) => {
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

export default {
  registerUser,
  loginUser,
  getUserById,
  verifyRegisterationEmail,
  verifyPasswordResetCode,
  resetPassword,
  sendPasswordResetCode,
  changeUsername,
  changePassword,
};
