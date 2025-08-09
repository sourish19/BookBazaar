import { Schema, model } from 'mongoose';
import {
  PAYMENT_STATUS,
  AVAILABLE_PAYMENT_STATUS,
} from '../utils/constants.util.js';

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: AVAILABLE_PAYMENT_STATUS,
      default: PAYMENT_STATUS.CREATED,
    },
    errorReason: {
      type: String, // store Razorpay failure reason or cancellation note
    },
  },
  { timestamps: true }
);

const Payment = model('payment', paymentSchema);

export default Payment;
