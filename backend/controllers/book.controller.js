import fs from 'fs';

import ApiResponse from '../utils/apiResponse.util.js';
import Books from '../models/books.model.js';
import ApiError from '../utils/apiError.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import {
  staticFilePath,
  localFilePath,
  generateUniqueId,
} from '../utils/helper.util.js';
import cloudinary from '../utils/cloudinary.util.js';

const addBooks = asyncHandler(async (req, res) => {
  const { title, author, genre, description, publishedDate, price, stock } =
    req.body;

  const coverImage = req.file?.filename;

  if (!coverImage) throw new ApiError([], 'No book cover image found', 404);

  const availableBook = await Books.findOne({ title, author });

  // if Book found in db throw an error
  if (availableBook) throw new ApiError([], 'Book already exists', 400);

  const bookImgUrl = staticFilePath(req, req.file?.filename);
  const bookLocalImgUrl = localFilePath(req, req.file?.filename);
  const publidId = generateUniqueId('bookCoverImg');

  // Creates and saves in the db
  const createBook = await Books.create({
    title,
    author,
    genre,
    description,
    publishedDate,
    price,
    stock,
    coverImage: {
      url: bookImgUrl || 'https://placehold.co/400',
      localPath: bookLocalImgUrl || '',
    },
    createdBy: req.user?._id,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(bookLocalImgUrl, {
      public_id: publidId,
    });

    createBook.coverImage = {
      publicId: uploadResult.public_id || '',
      url: uploadResult.secure_url || createBook.coverImage.url,
      localPath: '',
    };

    fs.unlink(bookLocalImgUrl, (err) => {
      if (err) {
        console.error('Unable to remove book cover image file');
      }
    });

    await createBook.save({ validateBeforeSave: false });
  } catch (error) {
    console.error(
      `Cloudinary upload failed for book "${title}":`,
      error.message
    );
  }

  // Recheck if book is created successfully
  const createdBook = await Books.findById(createBook._id);

  if (!createdBook) throw new ApiError([], 'Unable to add book', 500);

  //  Return the db book details for frontend to display it
  res.status(201).json(
    new ApiResponse(201, 'Book added successfully', [
      {
        bookId: createBook._id,
        title: createBook.title,
        author: createBook.author,
        genre: createBook.genre,
        description: createBook.description,
        publishedDate: createBook.publishedDate,
        price: createBook.price,
        stock: createBook.stock,
        coverImage: createBook.coverImage.url,
      },
    ])
  );
});

const getBookDetails = asyncHandler(async (req, res) => {
  const bookDetails = await Books.findById(req.params?.bookId).select(
    '-createdBy'
  );

  if (!bookDetails) throw new ApiError([], { message: 'Book not found' }, 404);

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
    new ApiResponse(200, { message: 'Book details retrived successfully' }, [
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

    if (!updateBook) throw new ApiError([], { message: 'Book not found' }, 404);

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

  if (!findBook) throw new ApiError([], { message: 'Book not found' }, 404);

  try {
    const deleteBookImg = await cloudinary.uploader.destroy(
      findBook.coverImage.publicId
    );
  } catch (error) {
    console.error(
      `Cloudinary deletion failed for book "${title} & public_Id ${findBook.coverImage.publicIdd}":`,
      error.message
    );
  }

  res.status(200).json(
    new ApiResponse(200, { message: 'Book deleted successfully' }, [
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

  const booksData = books?.map((book) => ({
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

  res.status(200).json(
    new ApiResponse(
      200,
      {
        message: books.length
          ? `${books.length} books found.`
          : 'No books found',
      },
      booksData
    )
  );
});

export {
  addBooks,
  getBookDetails,
  updateBookDetails,
  deleteBook,
  listAllBooks,
};
