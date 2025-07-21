import { Router } from 'express';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import isApiKeyValid from '../middlewares/apiKey.middleware.js';

const router = Router();

router.route('/orders').post(isLoggedIn, isApiKeyValid); // Place an order
router.route('/orders').get(isLoggedIn, isApiKeyValid); // list users order
router.route('/orders/:id').get(isLoggedIn, isApiKeyValid); // Order details

export default router;
