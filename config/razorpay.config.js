import Razorpay from 'razorpay';

import { RAZORPAY } from '../utils/constants.util.js';

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY.key_id,
  key_secret: RAZORPAY.key_secret,
});

export default razorpayInstance;
