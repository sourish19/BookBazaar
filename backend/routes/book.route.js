import { Router } from 'express';

import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  isLoggedIn,
  verifyPermission,
} from '../middlewares/auth.middleware.js';
import { addBooks } from '../controllers/book.controller.js';
import { addBookValidation } from '../validators/book.validator.js';
import validate from '../middlewares/userValidate.middleware.js';

const router = Router();

router
  .route('/')
  .post(
    isLoggedIn,
    isApiKeyValid,
    verifyPermission,
    addBookValidation(),
    validate,
    addBooks
  ); // Add Books - Adimin Only
router.route('/').get(isLoggedIn, isApiKeyValid); // List all books
router.route('/:id').get(isLoggedIn, isApiKeyValid); // get book details
router.route('/:id').put(isLoggedIn, isApiKeyValid, verifyPermission); // Update book - Admin only
router.route('/:id').delete(isLoggedIn, isApiKeyValid, verifyPermission); // Delete book - Admin only

export default router;
