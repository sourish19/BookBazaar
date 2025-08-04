import { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    books: [
      {
        bookId: { type: Schema.Types.ObjectId, ref: 'Books', required: true },
        price: { type: Number, min: 0, required: true },
        quantity: {
          type: Number,
          min: [1, 'Quantity can not be less then 1.'],
          default: 1,
          required: true,
        },
        subTotal: {
          type: Number,
          min: 0,
          required: true,
        },
      },
    ],
    bill: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const Cart = model('car', cartSchema);

export default Cart;
