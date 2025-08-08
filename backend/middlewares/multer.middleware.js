import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  // This storage needs public/images folder in the root directory
  // Else it will throw an error saying cannot find path public/images
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  // Store file in a .png/.jpeg/.jpg format  y
  filename: function (req, file, cb) {
    let fileExtension = '';
    if (file.originalname.includes('.')) {
      fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf('.')
      );
    }

    const fileWithoutExtension = file.originalname
      .split('.')[0]
      .toLowerCase()
      .split(' ')
      ?.join('-');

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // For unique file name

    cb(null, fileWithoutExtension + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000 * 1000,
  },
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter called with file:', file);
    console.log('File fieldname:', file.fieldname);
    console.log('File originalname:', file.originalname);
    cb(null, true);
  },
});

export default upload;
