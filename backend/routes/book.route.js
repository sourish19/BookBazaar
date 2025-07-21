import { Router } from 'express';

import isLogedIn from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';
import { isLogedIn, verifyPermission } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').post(isLogedIn, isApiKeyValid, verifyPermission); // Add Books - Adimin Only
router.route('/').get(isLogedIn, isApiKeyValid); // List all books
router.route('/:id').get(isLogedIn, isApiKeyValid); // get book details
router.route('/:id').put(isLogedIn, isApiKeyValid, verifyPermission); // Update book - Admin only
router.route('/:id').delete(isLogedIn, isApiKeyValid, verifyPermission); // Delete book - Admin only

export default router;
