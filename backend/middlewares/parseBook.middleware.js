import ApiError from '../utils/apiError.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

// Middleware to parse the 'book' JSON field
const parseBookJSON = asyncHandler(async (req, res, next) => {
  if (!req.body?.book)
    throw new ApiError([], "Invalid JSON in 'book' field", 400);

  const bookData = JSON.parse(req.body.book);

  req.body = { ...bookData };

  next();
});

export default parseBookJSON;
