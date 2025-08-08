import { body, param } from 'express-validator';

const placeOrderValidator = () => {
  return [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Items must be an non-empty array'),
    body('items.*.bookId')
      .notEmpty()
      .withMessage('bookId is required')
      .bail()
      .isMongoId()
      .withMessage('Invalid bookId'),
    body('items.*.quantity')
      .notEmpty()
      .withMessage('quantity is required')
      .bail()
      .isInt({ min: 1 })
      .withMessage('quantity must be a positive integer'),
    body('shippingDetails.addressLine1')
      .trim()
      .notEmpty()
      .withMessage('Address Line 1 is required'),
    body('shippingDetails.addressLine2')
      .optional()
      .trim()
      .isString()
      .withMessage('Address Line 2 must be a string'),
    body('shippingDetails.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('shippingDetails.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    body('shippingDetails.postalCode')
      .trim()
      .notEmpty()
      .withMessage('Postal Code is required'),
    body('shippingDetails.country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),
    body('shippingDetails.phoneNumber')
      .notEmpty()
      .withMessage('Phone Number is required')
      .isInt()
      .withMessage('Phone Number must be a number'),
  ];
};

const orderIdValidation = () => {
  return [
    param('orderId')
      .notEmpty()
      .withMessage('orderId is required')
      .isMongoId()
      .withMessage('Invalid orderId'),
  ];
};

export { placeOrderValidator, orderIdValidation };
