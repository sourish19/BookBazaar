import { Router } from 'express';

const router = Router();

router.route('/books/:bookId/reviews').post(); // Add review to a book
router.route('/books/:bookId/reviews').get(); // List Reviews for a book
router.route('/reviews/:id').delete(); // Delete reviews

export default router;
