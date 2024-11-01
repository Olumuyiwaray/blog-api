import { Request, Response, NextFunction } from 'express';
import services from '../services/user.service';
import { ILogin, IRegister } from '../interfaces/auth';

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDTO: IRegister = { ...req.body };
  if (req.file) {
    userDTO.profile_image = req.file.location;
  }

  try {
    const result = await services.registerUser(userDTO, req);

    const responseObj = {
      isSuccess: true,
      message: result,
    };
    res.status(201).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const verifyRegisterationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  try {
    const result = await services.verifyRegisterationEmail(token);

    const responseObj = {
      isSuccess: true,
      message: result,
    };
    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const userDTO: ILogin = { ...req.body };

  try {
    const payload = await services.loginUser(userDTO);

    const { token, user } = payload;

    const responseObj = {
      isSuccess: true,
      message: 'Login successfull',
      token,
      user,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user;

  try {
    const user = await services.getUserById(userId);

    const responseObj = {
      isSuccess: true,
      message: 'User Found!',
      user,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const sendResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const result = await services.sendPasswordResetCode(email, req);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resetCode = req.params.verifyResetCode;
  try {
    const code = await services.verifyPasswordResetCode(resetCode);

    const responseObj = {
      isSuccess: true,
      message: 'Code Valid',
      code,
    };
    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const result = await services.resetPassword(password, token);

    const responseObj = {
      isSuccess: true,
      message: result,
    };
    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const changeUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { newUsername } = req.body;
  try {
    const result = await services.changeUsername(userId, newUsername);

    const responseObj = {
      isSuccess: true,
      message: result,
    };

    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { password } = req.body;
  try {
    const result = await services.changePassword(userId, password);

    const responseObj = {
      isSuccess: true,
      message: result,
    };
    res.status(200).json(responseObj);
  } catch (error) {
    next(error);
  }
};

const logOut = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  const responseObj = {
    isSuccess: true,
    message: 'Log out successfull',
  };
  res.status(200).json(responseObj);
};

export default {
  registerUser,
  loginUser,
  verifyRegisterationEmail,
  verifyResetCode,
  getUserById,
  changeUsername,
  changePassword,
  resetPassword,
  sendResetCode,
  logOut,
};
