import { Router } from 'express';

import generateApiKey from '../controllers/apiKey.controller.js';
import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser,
  userProfile,
  changeCurrentPassword,
  forgotPassword,
  resetPassword,
  resendEmailVerification,
} from '../controllers/auth.controller.js';
import {
  userRegistrationValidation,
  userChangePasswordValidation,
  userResetPasswordValidation,
  userEmailValidation,
} from '../validators/index.validator.js';
import validate from '../middlewares/userValidate.middleware.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// Unsecured Routes
router
  .route('/register')
  .post(userRegistrationValidation(), validate, registerUser);
router.route('/verify-email/:token').get(verifyEmail);
router.route('/login').post(userRegistrationValidation(), validate, loginUser);
router.route('/refresh-access-token').patch(refreshAccessToken);
router
  .route('/resend-email-verification')
  .patch(userEmailValidation(), validate, resendEmailVerification);
router
  .route('/forgot-password')
  .patch(userEmailValidation(), validate, forgotPassword);
router
  .route('/reset-password/:resetPasswordToken')
  .patch(userResetPasswordValidation(), validate, resetPassword);
router.route('/api-key').post(isLoggedIn, generateApiKey); // Api_key route

// Secure Routes
router.route('/logout').patch(isLoggedIn, logoutUser);
router.route('/me').get(isLoggedIn, userProfile);
router
  .route('/change-current-password')
  .patch(
    isLoggedIn,
    userChangePasswordValidation(),
    validate,
    changeCurrentPassword
  );

export default router;
