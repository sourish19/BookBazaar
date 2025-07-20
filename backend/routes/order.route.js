import { Router } from 'express';

const router = Router();

router.route('/orders').post(); // Place an order
router.route('/orders').get(); // list users order
router.route('/orders/:id').get(); // Order details

export default router;
