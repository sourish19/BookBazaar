import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  createRazorPayOrder,
  verifyRazorpayPayment,
  failedRazorpayPayment,
} from '../controllers/payment.controller.js';
import {
  placeRazorpayOrderValidator,
  validateRazorpayPayment,
} from '../validators/payment.validator.js';
import validate from '../middlewares/validationError.middleware.js';

const router = Router();

router
  .route('/razorpay/create')
  .post(
    isLoggedIn,
    isApiKeyValid,
    placeRazorpayOrderValidator(),
    validate,
    createRazorPayOrder
  );
router
  .route('/razorpay/verify')
  .post(
    isLoggedIn,
    isApiKeyValid,
    validateRazorpayPayment(),
    validate,
    verifyRazorpayPayment
  );
router
  .route('/razorpay/failed')
  .post(isLoggedIn, isApiKeyValid, failedRazorpayPayment);

export default router;
