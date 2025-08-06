import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  placeOrder,
  listOrders,
  getOrderDetails,
  createRazorPayOrder,
} from '../controllers/order.controller.js';
import { placeOrderValidator } from '../validators/order.validator.js';
import validate from '../middlewares/validationError.middleware.js';

const router = Router();

router
  .route('/orders')
  .post(
    isLoggedIn,
    isApiKeyValid,
    placeOrderValidator(),
    validate(),
    placeOrder
  ); // Place an order
router.route('/orders').get(isLoggedIn, isApiKeyValid, listOrders); // list users order
router.route('/orders/:id').get(isLoggedIn, isApiKeyValid, getOrderDetails); // Order details

// RAZORPAY ROUTES
router.route('/razorpay/orders').post(createRazorPayOrder); // Create razorpay order

export default router;
