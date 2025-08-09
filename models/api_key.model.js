import crypto from 'crypto';
import { Schema, model } from 'mongoose';

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

const ApiKey = model('Api_Key', apiKeySchema);

export default ApiKey;
