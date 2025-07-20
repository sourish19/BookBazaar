import { Schema, model } from 'mongoose';

const apiKeySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const ApiKey = model('Api_Key', apiKeySchema);

export default ApiKey;
