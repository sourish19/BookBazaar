import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  placeOrder,
  listOrders,
  getOrderDetails,
} from '../controllers/order.controller.js';

const router = Router();

router.route('/orders').post(isLoggedIn, isApiKeyValid, placeOrder); // Place an order
router.route('/orders').get(isLoggedIn, isApiKeyValid, listOrders); // list users order
router.route('/orders/:id').get(isLoggedIn, isApiKeyValid, getOrderDetails); // Order details

export default router;
