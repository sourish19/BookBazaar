import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  addItemToCart,
  getUserCart,
  clearCart,
  removeItemFromCart,
} from '../controllers/cart.controller.js';

const router = Router();

// AUTHENTICATED ROUTES
router.route('/get-cart-items').get(isLoggedIn, isApiKeyValid, getUserCart); // Get all cart Items
router.route('/add-cart-item').post(isLoggedIn, isApiKeyValid, addItemToCart); // Add a Item to cart
router
  .route('/delete-cart-items')
  .delete(isLoggedIn, isApiKeyValid, removeItemFromCart); // Delete Item/ Item quantity from cart
router.route('/delete-cart').delete(isLoggedIn, isApiKeyValid, clearCart); // Delete entire cart Items

export default router;
