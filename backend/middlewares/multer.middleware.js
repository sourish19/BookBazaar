import multer from 'multer';

const storage = multer.diskStorage({
  // This storage needs public/images folder in the root directory
  // Else it will throw an error saying cannot find path public/images
  destination: function (req, file, cb) {
    cb(null, '../public/images');
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
});

export default upload;
