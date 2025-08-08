import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../utils/constants.util.js';

cloudinary.config({
  cloud_name: CLOUDINARY.cloud_name,
  api_key: CLOUDINARY.api_key,
  api_secret: CLOUDINARY.api_secret,
});

export default cloudinary;
