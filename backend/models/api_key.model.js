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

apiKeySchema.methods.generateApiTokens = async function () {
  try {
    const unhashedApiToken = crypto.randomBytes(32).toString('hex');
    const hashedApiToken = crypto
      .createHash('sha256')
      .update(unhashedApiToken)
      .digest('hex');
    const tokenExpiry = Date.now() + 24 * 7 * 60 * 60 * 1000;
    return { unhashedApiToken, hashedApiToken, tokenExpiry };
  } catch (error) {
    console.error('Unable to generate Api token');
  }
};

const ApiKey = model('Api_Key', apiKeySchema);

export default ApiKey;
