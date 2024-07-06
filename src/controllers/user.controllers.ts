import { Request, Response, NextFunction } from 'express';
import {
  changePassWord,
  changeUserName,
  getUserAccount,
  loginUser,
  registerUser,
  resetUserPassword,
  sendPasswordResetLink,
  verifyPasswordResetLink,
  verifyUserRegisterationEmail,
} from '../services/user.service';
import { ILogin, IRegister } from '../interfaces/auth';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDTO: IRegister = { ...req.body };
  if (req.file) {
    userDTO.profile_image = req.file.location;
  }

  try {
    const result = await registerUser(userDTO, req);
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

export const verifyRegisteredEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  try {
    const result = await verifyUserRegisterationEmail(token);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDTO: ILogin = { ...req.body };

  try {
    const payload = await loginUser(userDTO);

    const { token, user } = payload;

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const getUSer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  try {
    const user = await getUserAccount(userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const sendResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const result = await sendPasswordResetLink(email, req);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const verifyResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;
  try {
    const myToken = await verifyPasswordResetLink(token);
    res.status(200).json({ token: myToken });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const result = await resetUserPassword(password, token);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { newUsername } = req.body;
  try {
    const result = await changeUserName(userId, newUsername);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { password } = req.body;
  try {
    const result = await changePassWord(userId, password);
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  res.status(200).send('Log out successfull');
};
