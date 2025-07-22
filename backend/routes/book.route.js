import { Router } from 'express';

import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  isLoggedIn,
  verifyPermission,
} from '../middlewares/auth.middleware.js';
import {
  addBooks,
  getBookDetails,
  updateBookDetails,
  deleteBook,
} from '../controllers/book.controller.js';
import {
  addBookValidation,
  getBookDetailsValidation,
  updateBookDetailsValidation,
} from '../validators/book.validator.js';
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
router.route('/:id').get(getBookDetailsValidation(), validate, getBookDetails); // Get book details
router
  .route('/:id')
  .put(
    isLoggedIn,
    isApiKeyValid,
    verifyPermission,
    updateBookDetailsValidation(),
    validate,
    updateBookDetails
  ); // Update book - Admin only
router
  .route('/:id')
  .delete(isLoggedIn, isApiKeyValid, verifyPermission, deleteBook); // Delete book - Admin only

export default router;
