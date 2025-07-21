import jwt from 'jsonwebtoken';

import asyncHandler from '../utils/asyncHandler.util.js';
import { ACCESS_TOKEN } from '../utils/constants.util.js';
import ApiError from '../utils/apiError.util.js';
import User from '../models/auth.model.js';

const isLogedIn = asyncHandler(async (req, res, next) => {
  // Check if accessTkn is there in cookies or in headers
  const accessToken =
    req.cookies?.accessToken ||
    (req.headers['authorization']?.includes('Bearer ')
      ? req.headers['authorization']?.slice(7).trim()
      : null);

  if (!accessToken) throw new ApiError([], 'Unauthorized request', 401);

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN.secret);

    if (!decoded)
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError([], 'Unauthorized request', 401);

    const decodedUser = await User.findById(decoded.id).select(
      '-password -refreshToken -isEmailValid -emailVerificationToken -emailVerificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry'
    );

    if (!decodedUser) throw new ApiError([], 'Unauthorized request', 401);

    req.user = decodedUser;

    next();
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(
      error || [],
      error?.message || 'Access Token Expired',
      401
    );
  }
});

const verifyPermission = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select(
    '-password -refreshToken -isEmailValid -emailVerificationToken -emailVerificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry'
  );

  if (user.userRole === 'USER')
    throw new ApiError([], { message: 'Unauthorized Client' }, 403);

  next();
});

export { isLogedIn, verifyPermission };
