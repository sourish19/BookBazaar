import { Schema, model } from 'mongoose';

import { BOOKS_GENRE, AVAILABLE_BOOKS_GENRE } from '../utils/constants.util.js';

const booksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    genre: {
      type: String,
      enum: AVAILABLE_BOOKS_GENRE,
      default: BOOKS_GENRE.UNCATAGORIZED,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    publishedDate: {
      type: Date,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: {
        url: String,
        localPath: String,
        public_Id: String,
      },
      default: {
        url: 'https://placehold.co/400',
        localPath: '',
        public_Id: '',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);
//  prevents exact duplicates, not individual duplicates of just title or just author
//  No two books can have the exact same combination of title and author.
booksSchema.index({ title: 1, author: 1 }, { unique: true });

const Books = model('Books', booksSchema);

export default Books;
