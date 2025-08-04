import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  addItemToCart,
  getUserCart,
  clearCart,
  removeItemFromCart,
} from '../controllers/cart.controller.js';
import {
  addToCartValidation,
  validateCartIdParam,
} from '../validators/cart.validator.js';
import validate from '../middlewares/validationError.middleware.js';

const router = Router();

// AUTHENTICATED ROUTES
router
  .route('/get-cart-items/:cartId')
  .get(isLoggedIn, isApiKeyValid, validateCartIdParam(), validate, getUserCart); // Get all cart Items
router
  .route('/add-cart-item')
  .post(
    isLoggedIn,
    isApiKeyValid,
    addToCartValidation(),
    validate,
    addItemToCart
  ); // Add a Item to cart
router
  .route('/delete-cart-item/:cartId')
  .delete(
    isLoggedIn,
    isApiKeyValid,
    validateCartIdParam(),
    validate,
    removeItemFromCart
  ); // Delete Item from cart
router.route('/delete-cart').delete(isLoggedIn, isApiKeyValid, clearCart); // Delete entire cart Items

export default router;
