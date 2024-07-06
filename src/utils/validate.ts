import { body, validationResult, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateLogin = [
  // Check user input for both empty and invalid input

  body('email')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .bail()
    .isString()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('This field must not be empty')
    .bail()
    .escape(),
];

export const validateSignup = [
  // Validate user input checking for both empty and invalid inputs
  body('name')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .bail(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .bail()
    .isString()
    .isLength({ min: 4 })
    .withMessage('username must not be less than 4 characters')
    .bail()
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .bail()
    .isString()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .bail()
    .isString()
    .isLength({ min: 5, max: 20 })
    .withMessage('password must be between 5 and 20 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'Password must contain one capital letter, one small letter, one number and one symbol'
    )
    .bail()
    .escape(),
];

export const validateQuery = [
  // validate user search input
  query('search')
    .trim()
    .notEmpty()
    .withMessage('Empty query detected')
    .bail()
    .isString(),
];

export const validateBlogPost = [
  // validate user search input

  body('title')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .isString()
    .escape(),
  body('snippet')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .isString()
    .escape(),
  body('body')
    .trim()
    .notEmpty()
    .withMessage('This field cannot be empty')
    .isString()
    .escape(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  // Check if any errors occur and send them to the client if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};
