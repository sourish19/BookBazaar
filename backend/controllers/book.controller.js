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
        title: createBook.title,
        author: createBook.author,
        genre: createBook.genre,
        description: createBook.description,
        publishedDate: createBook.publishedDate,
        price: createBook.price,
        stock: createBook.stock,
        coverImage: createBook.coverImage,
      },
    ])
  );
});

const getBookDetails = asyncHandler(async (req, res) => {
  const bookDetails = await Books.findById(req.params?.bookId).select(
    '-createdBy'
  );

  if (!bookDetails)
    throw new ApiError([], { message: 'Cannot find the required Book' }, 400);

  // Destructure bookDetails
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

  // Also Check if user sends an empty object since the validation fields are optional
  if (!bookUpdateField || Object.keys(bookUpdateField).length === 0)
    throw new ApiError([], { message: 'No fields provided for update' }, 400);

  try {
    const updateBook = await Books.findByIdAndUpdate(bookId, bookUpdateField, {
      new: true,
      runValidators: true,
    }).select('-createdBy');

    if (!updateBook)
      throw new ApiError([], { message: 'Invalid Book ID' }, 400);

    res.status(200).json(
      new ApiResponse(200, { message: 'Book updated successfully' }, [
        {
          bookId: updateBook._id,
          title: updateBook.title,
          author: updateBook.author,
          genre: updateBook.genre,
          description: updateBook.description,
          publishedDate: updateBook.publishedDate,
          price: updateBook.price,
          stock: updateBook.stock,
          coverImage: updateBook.coverImage,
        },
      ])
    );
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000)
      throw new ApiError(
        [],
        { message: 'A book with this title and author already exists' },
        400
      );
    throw error;
  }
});

const deleteBook = asyncHandler(async (req, res) => {
  const findBook = await Books.findByIdAndDelete(req.params?.bookId, {
    new: true,
  }).select('-createdBy');

  if (!findBook) throw new ApiError([], { message: 'Invalid Book ID' }, 400);

  res.status(200).json(
    new ApiResponse(200, { message: 'Successfully deleted Book' }, [
      {
        bookId: findBook._id,
        title: findBook.title,
        author: findBook.author,
        genre: findBook.genre,
        description: findBook.description,
        publishedDate: findBook.publishedDate,
        price: findBook.price,
        stock: findBook.stock,
        coverImage: findBook.coverImage,
      },
    ])
  );
});

const listAllBooks = asyncHandler(async (req, res) => {
  const filterItems = req.query;

  let books;
  if (Object.keys(filterItems).length > 0) {
    books = await Books.find(filterItems).select('-createdBy');
  } else {
    books = await Books.find().select('-createdBy');
  }

  if (!books || books.length === 0) {
    throw new ApiError([], { message: 'Books not found' }, 400);
  }

  const booksData = books.map((book) => ({
    bookId: book._id,
    title: book.title,
    author: book.author,
    genre: book.genre,
    description: book.description,
    publishedDate: book.publishedDate,
    price: book.price,
    stock: book.stock,
    coverImage: book.coverImage,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(200, { message: 'Books fetched successfully' }, booksData)
    );
});

export {
  addBooks,
  getBookDetails,
  updateBookDetails,
  deleteBook,
  listAllBooks,
};
