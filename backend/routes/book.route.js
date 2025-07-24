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
  listAllBooks,
} from '../controllers/book.controller.js';
import {
  addBookValidation,
  bookIdValidation,
  updateBookDetailsValidation,
} from '../validators/book.validator.js';
import validate from '../middlewares/userValidate.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// Unsecured Routes
router.route('/').get(listAllBooks); // List all books
router.route('/:bookId').get(bookIdValidation(), validate, getBookDetails); // Get book details

// Secured Routes
router.route('/').post(
  isLoggedIn,
  isApiKeyValid,
  verifyPermission,
  addBookValidation(), // Need to handle Cover Image
  validate,
  upload.single('bookCoverImg'),
  addBooks
); // Add Books - Adimin Only
router
  .route('/:bookId')
  .put(
    isLoggedIn,
    isApiKeyValid,
    verifyPermission,
    updateBookDetailsValidation(),
    validate,
    updateBookDetails
  ); // Update book - Admin only
router
  .route('/:bookId')
  .delete(
    isLoggedIn,
    isApiKeyValid,
    verifyPermission,
    bookIdValidation(),
    validate,
    deleteBook
  ); // Delete book - Admin only

export default router;
