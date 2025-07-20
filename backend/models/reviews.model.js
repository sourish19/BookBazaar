import { Schema, model } from 'mongoose';

const reviewsSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Books',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Reviews = model('Reviews', reviewsSchema);

export default Reviews;
