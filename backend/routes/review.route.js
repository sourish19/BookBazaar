import { Router } from 'express';

import {
  isLoggedIn,
  verifyPermission,
} from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';

const router = Router();

router.route('/books/:bookId/reviews').post(isLoggedIn, isApiKeyValid); // Add review to a book
router.route('/books/:bookId/reviews').get(isLoggedIn, isApiKeyValid); // List Reviews for a book
router
  .route('/reviews/:id')
  .delete(isLoggedIn, isApiKeyValid, verifyPermission); // Delete reviews

export default router;
