import { body, param } from 'express-validator';

const addBookReviewValidation = () => {
  return [
    body('comment').trim().notEmpty().withMessage('Review is empty'),
    body('rating')
      .notEmpty()
      .withMessage('Rating is empty')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating should be a Number'),
    param('bookId')
      .notEmpty()
      .withMessage('Book ID is empty')
      .isMongoId()
      .withMessage('Book ID not valid'),
  ];
};

const bookIdValidation = () => {
  return [
    param('bookId')
      .notEmpty()
      .withMessage('Book ID is empty')
      .isMongoId()
      .withMessage('Book ID not valid'),
  ];
};

export { addBookReviewValidation, bookIdValidation };
