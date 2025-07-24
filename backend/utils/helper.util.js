export const staticFilePath = (req, filename) => {
  return `${req.protocol}://${req.host}/images/${filename}`;
};

export const localFilePath = (req, filename) => {
  return `/public/images/${filename}`;
};

export const generateUniqueId = (path) => {
  return `${path}/${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};
