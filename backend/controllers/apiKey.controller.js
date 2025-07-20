import crypto from 'crypto';

import User from '../models/auth.model.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiKey from '../models/api_key.model.js';
import ApiResponse from '../utils/apiResponse.util.js';
import ApiError from '../utils/apiError.util.js';

const generateApiKey = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    '-password -refreshToken -isEmailValid -emailVerificationToken -emailVerificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry'
  );

  if (!user) throw new ApiError([], 'Invalid User', 400);

  const token = crypto.randomBytes(32).toString('hex');

  const userApiKey = await ApiKey.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        apiToken: token,
        apiTokenExpiry: Date.now() + 24 * 7 * 60 * 60 * 1000,
      },
    },
    { upsert: true, new: true }
    //upsert - Update the document if it exists, otherwise insert a new one.
    //new - returns the updated document
  );

  res
    .status(200)
    // As I am using Postman i have to manually set the headers every time
    // but frontend will set it when sending req to backend
    .set('x-api-key', token)
    .json(new ApiResponse(200, 'Api key generated successfully', []));
});

export default generateApiKey;
