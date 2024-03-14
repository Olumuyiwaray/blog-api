import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express';


export const validateLogin = [
    // Check user input for both empty and invalid input
    body('username')
        .trim()
        .notEmpty()
        .escape(),
    body('password')
        .trim()
        .notEmpty()
        .escape()
  ];
  
export const validateSignup = [
    // Validate user input checking for both empty and invalid inputs
      body('username')
          .trim()
          .notEmpty()
          .isLength({ min: 4, })
          .withMessage('username must not be less than 4 characters')
          .escape(),
      body('name')
          .trim()
          .notEmpty()
          .escape(),
      body('password')
          .trim()
          .notEmpty()
          .isLength({ min: 5 })
          .withMessage('password must not be less than 5 characters')
          .escape()
  ];
  
export const validate = (req: Request, res: Response, next: NextFunction) => {
    // Check if any errors occur and send them to the client if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  };