import crypto from 'crypto';

import { Schema, model } from 'mongoose';
import ApiError from '../utils/apiError.util.js';

const apiKeySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    apiToken: {
      type: String,
    },
    apiTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

apiKeySchema.pre('save', async function (next) {
  const apiKey = this;
  if (!apiKey.isModified('apiToken')) return next();
  try {
    const hashedApiKey = crypto
      .createHash('sha256')
      .update(apiKey.apiToken)
      .digest('hex');
    apiKey.apiToken = hashedApiKey;
    return next();
  } catch (error) {
    console.error('Unable to generate hashed token');
    next(error);
  }
});

const ApiKey = model('Api_Key', apiKeySchema);

export default ApiKey;
