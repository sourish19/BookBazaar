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

  // Recheck if book is created successfully
  const createdBook = await Books.findById(createBook._id);

  if (!createdBook)
    throw new ApiError([], { message: 'Unable to add book' }, 500);

  //  Return the db book details for frontend to display it
  res.status(200).json(
    new ApiResponse(200, { message: 'Book added successfully' }, [
      {
        bookId: createBook._id,
        title,
        author,
        genre,
        description,
        publishedDate,
        price,
        stock,
        coverImage,
      },
    ])
  );
});

const getBookDetails = asyncHandler(async (req, res) => {
  const bookDetails = await Books.findById(req.params?.bookId);

  if (!bookDetails)
    throw new ApiError([], { message: 'Cannot find the required Book' }, 400);

  const {
    _id,
    title,
    author,
    genre,
    description,
    publishedDate,
    price,
    stock,
    coverImage,
  } = bookDetails;

  return res.status(200).json(
    new ApiResponse(200, { message: 'Book detail found' }, [
      {
        bookId: _id,
        title,
        author,
        genre,
        description,
        publishedDate,
        price,
        stock,
        coverImage,
      },
    ])
  );
});

const updateBookDetails = asyncHandler(async (req, res) => {
  const bookId = req.params?.bookId;
  const bookUpdateField = req.body;

  if (!bookUpdateField)
    throw new ApiError([], { message: 'Invalid Book Fields' }, 400);

  const updateBook = await Books.findByIdAndUpdate(bookId, bookUpdateField, {
    new: true,
    runValidators: true,
  });

  if (!updateBook) throw new ApiError([], { message: 'Invalid Book ID' }, 400);

  res.status(200).json(
    new ApiResponse(200, { message: 'Book updated successfully' }, [
      {
        bookId: createBook._id,
        title,
        author,
        genre,
        description,
        publishedDate,
        price,
        stock,
        coverImage,
      },
    ])
  );
});

const deleteBook = asyncHandler(async(req,res)=>{

})

export { addBooks, getBookDetails, updateBookDetails,deleteBook };
