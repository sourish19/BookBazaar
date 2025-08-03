import { Schema, model } from 'mongoose';
import {
  ORDER_STATUS,
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
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    orderStatus: {
      type: String,
      enum: AVAILABLE_ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

const Order = model('Order', orderSchema);

export default Order;
