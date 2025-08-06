import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  placeOrder,
  listOrders,
  getOrderDetails,
  createRazorPayOrder,
} from '../controllers/order.controller.js';
import {
  placeOrderValidator,
  orderIdValidation,
} from '../validators/order.validator.js';
import validate from '../middlewares/validationError.middleware.js';

const router = Router();

router
  .route('/orders/place-order')
  .post(isLoggedIn, isApiKeyValid, placeOrderValidator(), validate, placeOrder); // Place an order
router.route('/orders/list-orders').get(isLoggedIn, isApiKeyValid, listOrders); // list users all order
router
  .route('/orders/order-details/:orderId')
  .get(
    isLoggedIn,
    isApiKeyValid,
    orderIdValidation(),
    validate,
    getOrderDetails
  ); // Order details

// RAZORPAY ROUTES
router.route('/razorpay/orders').post(createRazorPayOrder); // Create razorpay order

export default router;
