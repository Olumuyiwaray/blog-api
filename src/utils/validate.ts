import { body, validationResult, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateLogin = [
  // Check user input for both empty and invalid input
  body('username').trim().notEmpty().escape(),
  body('password').trim().notEmpty().escape(),
];

export const validateSignup = [
  // Validate user input checking for both empty and invalid inputs
  body('username')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 4 })
    .withMessage('username must not be less than 4 characters')
    .escape(),
  body('name').trim().notEmpty().isString().escape(),
  body('password')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 5, max: 20 })
    .withMessage('password must be between 5 and 20 characters')
    .escape(),
];

export const validateQuery = [
  // validate user search input
  query('search').trim().notEmpty().isString(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  // Check if any errors occur and send them to the client if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};
