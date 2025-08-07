import { body, param } from 'express-validator';

const placeRazorpayOrderValidator = () => {
  return [
    body('orderId')
      .notEmpty()
      .withMessage('orderId is required')
      .isMongoId()
      .withMessage('Invalid orderId'),
  ];
};

const validateRazorpayPayment = () => {
  return [
    body('paymentInfo')
      .notEmpty()
      .withMessage('paymentInfo object is required'),
    body('paymentInfo.orderId')
      .notEmpty()
      .withMessage('Order ID is required')
      .isMongoId()
      .withMessage('Invalid Order ID'),
    body('paymentInfo.paymentId')
      .notEmpty()
      .withMessage('Payment ID is required')
      .isMongoId()
      .withMessage('Invalid Payment ID'),
    body('paymentInfo.razorpayOrderId')
      .notEmpty()
      .withMessage('Razorpay Order ID is required')
      .isString()
      .withMessage('Razorpay Order ID must be a string'),
    body('paymentInfo.razorpayPaymentId')
      .notEmpty()
      .withMessage('Razorpay Payment ID is required')
      .isString()
      .withMessage('Razorpay Payment ID must be a string'),
    body('paymentInfo.razorpaySignature')
      .notEmpty()
      .withMessage('Razorpay Signature is required')
      .isString()
      .withMessage('Razorpay Signature must be a string'),
  ];
};

export { placeRazorpayOrderValidator,validateRazorpayPayment };
