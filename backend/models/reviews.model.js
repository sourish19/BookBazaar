import { Schema, model } from 'mongoose';

const reviewsSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Books',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be atleast 1'],
      max: [5, 'Rating must be maximum 5'],
      required: true,
    },
  },
  { timestamps: true }
);

//Ensures that a user can only leave one review per book
// This compound index enforces uniqueness on the combination of userId and bookId
// Prevents duplicate reviews at the database level instead of handling it manually in code
reviewsSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Reviews = model('Reviews', reviewsSchema);

export default Reviews;
