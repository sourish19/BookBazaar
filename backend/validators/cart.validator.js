import { body } from 'express-validator';

const addToCartValidation = () => {
  return [
    body('cartItems')
      .isArray({ min: 1 })
      .withMessage('cartItems must be a non-empty array'),

    body('cartItems.*.bookId')
      .notEmpty()
      .withMessage('bookId is required')
      .bail()
      .isMongoId()
      .withMessage('Invalid bookId'),

    body('cartItems.*.quantity')
      .notEmpty()
      .withMessage('quantity is required')
      .bail()
      .isInt({ min: 1 })
      .withMessage('quantity must be a positive integer'),
  ];
};

export { addToCartValidation };

// bail() -- stop further validation if one fails
