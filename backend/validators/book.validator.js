import { body } from 'express-validator';

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
    body('genre').optional().trim().toLowerCase(),
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
    body('coverImage')
      .optional()
      .trim()
      .isURL()
      .withMessage('Cover Image should be an URL'),
  ];
};

export { addBookValidation };
