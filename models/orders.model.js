import { Schema, model } from 'mongoose';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  AVAILABLE_PAYMENT_STATUS,
  AVAILABLE_ORDER_STATUS,
} from '../utils/constants.util.js';

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Books',
          required: true,
        },
        quantity: {
          type: Number,
          min: [1, 'Quantity can not be less then 1.'],
          default: 1,
          required: true,
        },
        price: {
          type: Number,
          min: 0,
          required: true,
        },
        subTotal: {
          type: Number,
          min: 0,
          required: true,
        },
      },
    ],
    itemCount: {
      type: Number,
      default: 0,
    },
    shippingDetails: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      enum: AVAILABLE_ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    paymentStatus: {
      type: String,
      enum: AVAILABLE_PAYMENT_STATUS,
      default: PAYMENT_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

const Order = model('Order', orderSchema);

export default Order;
