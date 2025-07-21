// Need to implement CoverImage using multer and cloudinary

import ApiResponse from '../utils/apiResponse.util.js';
import Books from '../models/books.model.js';
import ApiError from '../utils/apiError.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

const addBooks = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    genre,
    description,
    publishedDate,
    price,
    stock,
    coverImage,
  } = req.body;

  const availableBook = await Books.findOne({ title, author });

  // if Book found in db throw an error
  if (availableBook)
    throw new ApiError([], { message: 'Book is already registered' }, 400);

  // Creates and saves in the db
  const createBook = await Books.create({
    title,
    author,
    genre,
    description,
    publishedDate,
    price,
    stock,
    createdBy: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { message: 'Book added successfully' }, []));
});

export { addBooks };
