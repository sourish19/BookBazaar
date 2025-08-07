import crypto from 'crypto';

import Order from '../models/orders.model.js';
import Payment from '../models/payments.model.js';
import razorpayInstance from '../config/razorpay.config.js';
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  RAZORPAY,
} from '../utils/constants.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

const createRazorPayOrder = asyncHandler(async (req, res) => {
  const userOrder = await Order.findOne({
    _id: req.body?.orderId,
    userId: req.user?._id,
    paymentStatus: 'pending',
  }).select('-userId');

  if (!userOrder) throw new ApiError([], 'Order not found', 404);

  const razorpayOptions = {
    amount: userOrder.totalAmount * 100, // The amount for which the order was created, in currency subunits
    currency: 'INR',
    receipt: userOrder._id.toString(),
  };

  const razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);

  const userPayment = await Payment.create({
    userId: req.user?._id,
    orderId: req.body?.orderId,
    razorpayOrderId: razorpayOrder.id.toString(),
    totalAmount: userOrder.totalAmount,
  });

  res.status(200).json(
    new ApiResponse(200, 'RazorPay order created successfully', {
      key: RAZORPAY.key_id,
      razorpayOrderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
      amount: razorpayOrder.amount,
      status: razorpayOrder.status,
    })
  );
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const paymentInfo = req.body?.paymentInfo;

  //  Verify Razorpay signature to ensure the payment is genuine - Razorpay sends `razorpay_signature` to frontend after successful payment
  const validSignature = crypto
    .createHmac('sha256', RAZORPAY.key_secret)
    .update(paymentInfo.razorpayOrderId + '|' + paymentInfo.razorpayPaymentId)
    .digest('hex');

  if (paymentInfo.razorpaySignature !== validSignature)
    throw new ApiError([], 'Signature verification failed', 400);

  const paymentSuccess = await Payment.findOneAndUpdate(
    { _id: paymentInfo.paymentId },
    {
      $set: {
        razorpayPaymentId: paymentInfo.razorpayPaymentId,
        razorpaySignature: paymentInfo.razorpaySignature,
        status: PAYMENT_STATUS.PAID,
      },
    },
    { new: true }
  );

  if (!paymentSuccess) {
    throw new ApiError([], 'Payment record not found or update failed', 404);
  }

  const updateUserOrder = await Order.findOneAndUpdate(
    { _id: paymentInfo.orderId, userId: req.user?._id },
    {
      $set: {
        paymentId: paymentSuccess._id,
        paymentStatus: PAYMENT_STATUS.PAID,
      },
      orderStatus: ORDER_STATUS.CONFIRMED,
    },
    { new: true }
  );

    if (!updateUserOrder) {
    throw new ApiError([], 'User order record not found or update failed', 404);
  }

  res.status(200).json(new ApiResponse(200, 'Payment success', {}));
});

const failedRazorpayPayment = asyncHandler(async (req, res) => {});

export { createRazorPayOrder, verifyRazorpayPayment, failedRazorpayPayment };
