import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const staticFilePath = (req, filename) => {
  return `${req.protocol}://${req.host}/images/${filename}`;
};

export const localFilePath = (req, filename) => {
  return path.join(__dirname, '../public/images', filename);
};

export const generateUniqueId = (path) => {
  return `${path}/${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};
