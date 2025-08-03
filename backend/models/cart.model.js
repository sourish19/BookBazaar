import { Schema, model } from 'mongoose';

const cartItemsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    default: [],
    bill: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

const CartItems = model('cartItem', cartItemsSchema);

export default CartItems;
