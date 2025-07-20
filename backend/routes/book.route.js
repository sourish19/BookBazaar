import { Router } from 'express';

const router = Router();

router.route('/').post(); // Add Books - Adimin Only
router.route('/').get(); // List all books
router.route('/:id').get(); // get book details
router.route('/:id').put(); // Update book - Admin only
router.route('/:id').delete(); // Delete book - Admin only

export default router;
