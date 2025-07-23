import { body, param } from 'express-validator';
import ApiError from '../utils/apiError.util.js';

const userRegistrationValidation = () => {
  return [
    body('username')
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage('UserName is required'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .normalizeEmail()
      .withMessage('not a email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
  ];
};

const userLoginValidation = () => {
  return [
    body('username').trim().notEmpty().withMessage('UserName is required'),
    body('email').trim().notEmpty().withMessage('Email is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
  ];
};

const tokenValidation = () => {
  return [param('token').notEmpty().withMessage('Token is required')];
};

const userChangePasswordValidation = () => {
  return [
    body('old_password')
      .trim()
      .notEmpty()
      .withMessage('Old Password is required'),
    body('new_password')
      .trim()
      .notEmpty()
      .withMessage('New Password is required')
      .isLength({ min: 5 })
      .withMessage('New Password must be at least 5 characters long')
      .custom((value, { req }) => {
        if (value === req.body.old_password)
          throw new ApiError(
            [],
            'New password cannot be same as old password',
            400
          );
        return true;
      }),
    body('confirm_new_password').custom((value, { req }) => {
      if (value !== req.body.new_password)
        throw new ApiError(
          [],
          'Confirm password does not match new password',
          400
        );
      return true;
    }),
  ];
};

const userResetPasswordValidation = () => {
  return [
    body('new_password')
      .trim()
      .notEmpty()
      .withMessage('New Password is required')
      .isLength({ min: 5 })
      .withMessage('New Password must be at least 5 characters long'),
    body('confirm_new_password').custom((value, { req }) => {
      if (value !== req.body.new_password)
        throw new ApiError(
          [],
          'Confirm password does not match new password',
          400
        );
      return true;
    }),
  ];
};

const userEmailValidation = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('not a email'),
  ];
};

export {
  userRegistrationValidation,
  userLoginValidation,
  tokenValidation,
  userChangePasswordValidation,
  userResetPasswordValidation,
  userEmailValidation,
};
