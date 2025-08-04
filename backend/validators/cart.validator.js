import { body, param } from 'express-validator';

const addToCartValidation = () => {
  return [
    body('cartItems')
      .isArray({ min: 1 })
      .withMessage('cartItems must be a non-empty array'),
    body('cartItems.*.bookId')
      .notEmpty()
      .withMessage('bookId is required')
      .bail() // bail() -- stop further validation if one fails
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

const validateCartIdParam = () => {
  return [
    param('cartId')
      .notEmpty()
      .withMessage('cartId is required')
      .isMongoId()
      .withMessage('Invalid cartId'),
  ];
};

export { addToCartValidation, validateCartIdParam };
