import { Router } from 'express';

import {
  addBookReview,
  listAllBookReviews,
  deleteBookReview,
} from '../controllers/review.controller.js';
import {
  isLoggedIn,
  verifyPermission,
} from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import {
  addBookReviewValidation,
  bookIdValidation,
} from '../validators/review.validator.js';
import validate from '../middlewares/userValidate.middleware.js';

const router = Router();

router
  .route('/books/:bookId/review')
  .post(
    isLoggedIn,
    isApiKeyValid,
    addBookReviewValidation(),
    validate,
    addBookReview
  ); // Add review to a book
router
  .route('/books/:bookId/reviews')
  .get(bookIdValidation(), validate, listAllBookReviews); // List Reviews for a book
router
  .route('/review/:bookId')
  .delete(
    isLoggedIn,
    isApiKeyValid,
    bookIdValidation(),
    validate,
    deleteBookReview
  ); // Delete reviews

export default router;
