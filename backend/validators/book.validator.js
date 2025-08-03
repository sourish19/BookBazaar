import { body, param } from 'express-validator';
import { AVAILABLE_BOOKS_GENRE } from '../utils/constants.util.js';

const addBookValidation = () => {
  return [
    body('title')
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage('Book title is empty'),
    body('author')
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage('Book author is empty'),
    body('genre')
      .isArray({ min: 1 })
      .withMessage('Genre must be a non-empty array'),
    body('genre.*').isString().trim().toLowerCase().isIn(AVAILABLE_BOOKS_GENRE),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Book description is empty'),
    body('publishedDate')
      .trim()
      .notEmpty()
      .withMessage('Book Published Date is empty')
      .isDate()
      .withMessage('Published Date is not a date'),
    body('price')
      .trim()
      .notEmpty()
      .withMessage('Book price is empty')
      .isNumeric()
      .withMessage('Price should be Numeric'),
    body('stock')
      .trim()
      .notEmpty()
      .withMessage('Stock is empty')
      .isNumeric()
      .withMessage('Stock should be Numeric'),
  ];
};

const bookIdValidation = () => {
  return [
    param('bookId')
      .notEmpty()
      .withMessage('ID param is required')
      .isMongoId()
      .withMessage('Invalid bookId'),
  ];
};

const updateBookDetailsValidation = () => {
  return [
    param('bookId')
      .notEmpty()
      .withMessage('ID param is required')
      .isMongoId()
      .withMessage('Invalid bookId'),
    body('title').trim().toLowerCase().optional(),
    body('author').trim().toLowerCase().optional(),
    body('genre')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Genre must be a non-empty array'),
    body('genre.*')
      .optional()
      .isString()
      .trim()
      .toLowerCase()
      .isIn(AVAILABLE_BOOKS_GENRE),
    body('description').trim().optional(),
    body('publishedDate')
      .trim()
      .optional()
      .isDate()
      .withMessage('Published Date is not a date'),
    body('price')
      .trim()
      .optional()
      .isNumeric()
      .withMessage('Price should be Numeric'),
    body('stock')
      .trim()
      .optional()
      .isNumeric()
      .withMessage('Stock should be Numeric'),
    body('coverImage')
      .optional()
      .trim()
      .isURL()
      .withMessage('Cover Image should be an URL'),
  ];
};

export { addBookValidation, bookIdValidation, updateBookDetailsValidation };
