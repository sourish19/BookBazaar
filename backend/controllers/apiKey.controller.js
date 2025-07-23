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

  const { token, hashedToken, tokenExpiry } =
    await user.generateRandomHashedTokens();

  const userApiKey = await ApiKey.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        apiToken: hashedToken,
        apiTokenExpiry: tokenExpiry,
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
    .json(
      new ApiResponse(200, { message: `Api key generated successfully` }, [
        { apiKey: token },
      ])
    );
});

export default generateApiKey;
