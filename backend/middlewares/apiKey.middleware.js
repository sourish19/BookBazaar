import crypto from 'crypto';

import ApiError from '../utils/apiError.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiKey from '../models/api_key.model.js';

const isApiKeyValid = asyncHandler(async (req, res, next) => {
  const incommingApiKey = req.headers['x-api-key'] || req.body.apiKey;

  if (!incommingApiKey) throw new ApiError([], 'Invalid Api Key', 400);

  const hashedApiToken = crypto
    .createHash('sha256')
    .update(incommingApiKey)
    .digest('hex');

  const userApiKey = await ApiKey.findOne({
    userId: req.user?._id,
    apiToken: hashedApiToken,
    apiTokenExpiry: { $gt: Date.now() },
  });

  // Here Frontend will redirect to /api-key to generate a valid api-key
  if (!userApiKey) throw new ApiError([], 'User Api Key not found', 400);

  next();
});

export default isApiKeyValid;
