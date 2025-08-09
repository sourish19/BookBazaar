import ApiError from '../utils/apiError.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

function deepParseJSON(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepParseJSON);
  } else if (obj && typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = deepParseJSON(obj[key]);
    }
    return obj;
  } else if (typeof obj === 'string') {
    try {
      return JSON.parse(obj);
    } catch {
      return obj; // leave it as a string if not valid JSON
    }
  }
  return obj;
}

const parseBookJSON = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    throw new ApiError([], 'Missing request body', 400);
  }

  let bookData;

  if (typeof req.body === 'object' && req.body !== null) {
    bookData = req.body;
  } else if (typeof req.body === 'string') {
    try {
      bookData = JSON.parse(req.body);
    } catch {
      throw new ApiError([], 'Invalid JSON format in request body', 400);
    }
  } else {
    throw new ApiError(
      [],
      'Request body must be an object or valid JSON string',
      400
    );
  }

  if (typeof bookData !== 'object' || bookData === null) {
    throw new ApiError([], 'Parsed data must be an object', 400);
  }

  // Automatically parse all JSON-like strings
  req.body = deepParseJSON(bookData);

  next();
});

export default parseBookJSON;
