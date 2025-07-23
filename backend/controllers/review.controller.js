import Reviews from '../models/reviews.model.js';
import Books from '../models/books.model.js';
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

const addBookReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;
  const { bookId } = req.params;

  //   Check if book is available
  const bookExists = await Books.findById(bookId);

  if (!bookExists)
    throw new ApiError([], { message: 'Book dosent exist' }, 404);

  //   Use this try catch for duplicate key error
  try {
    const createReview = await Reviews.create({
      bookId,
      userId: req.user?._id,
      comment,
      rating,
    });

    // Recheck if the Review created successfully
    const newCreatedReview = await Reviews.findById(createReview._id).select(
      '-userId'
    );

    if (!newCreatedReview)
      throw new ApiError([], { message: 'Unable to add Review' }, 500);

    res.status(201).json(
      new ApiResponse(201, { message: 'Review added successfully' }, [
        {
          bookId: newCreatedReview.bookId,
          comment: newCreatedReview.comment,
          rating: newCreatedReview.rating,
        },
      ])
    );
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000)
      throw new ApiError(
        [],
        { message: 'You have already reviewed this book' },
        400
      );
    throw error;
  }
});

const listAllBookReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  //    Check if that Book exists
  const bookExists = await Books.findById(bookId).select('-createdBy');

  if (!bookExists)
    throw new ApiError([], { message: 'Book dosent exists' }, 404);

  // Populating the 'userId' field with only the 'username'
  // This replaces the ObjectId with actual user data (only username) in a single efficient query
  // This is how it will look ---
  //{
  //   comment: 'Great book',
  //   rating: 5,
  //   userId: {
  //     _id: 'userId123',
  //     username: 'john_doe'
  //   }
  // }
  const bookReviews = await Reviews.find({ bookId }).populate({
    path: 'userId',
    select: 'username',
  });

  if (!bookReviews || bookReviews.length === 0)
    throw new ApiError([], { message: 'Book' });

  const summarizedReview = bookReviews.map((review) => {
    return {
      username: review.userId.username,
      comment: review.comment,
      rating: review.rating,
    };
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: 'Extracted all Reviews' },
        summarizedReview
      )
    );
});

export { addBookReview, listAllBookReviews };
