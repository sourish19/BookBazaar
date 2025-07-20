import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
        },
      },
      {
        quantity: {
          type: Number,
          required: true,
        },
      },
      {
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Orders = model('Orders', orderSchema);

export default Orders;
