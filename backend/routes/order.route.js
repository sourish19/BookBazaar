import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  placeOrder,
  listOrders,
  getOrderDetails,
} from '../controllers/order.controller.js';
import {
  placeOrderValidator,
  orderIdValidation,
} from '../validators/order.validator.js';
import validate from '../middlewares/validationError.middleware.js';

const router = Router();

router
  .route('/place-order')
  .post(isLoggedIn, isApiKeyValid, placeOrderValidator(), validate, placeOrder); // Place an order
router.route('/list-orders').get(isLoggedIn, isApiKeyValid, listOrders); // list users all order
router
  .route('/order-details/:orderId')
  .get(
    isLoggedIn,
    isApiKeyValid,
    orderIdValidation(),
    validate,
    getOrderDetails
  ); // Order details

export default router;
