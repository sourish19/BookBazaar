import path from 'path';
import { fileURLToPath } from 'url';

// --- file paths and uniqueId
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

//  --- Cart ---
export const getInvalidItems = (cartItems, bookMap) => {
  return cartItems.reduce((acc, item) => {
    const book = bookMap.get(item.bookId);
    if (!book) {
      acc.push({ bookId: item.bookId, message: "Book doesn't exist" });
    } else if (book.stock < item.quantity) {
      acc.push({ bookId: item.bookId, message: 'Insufficient stock' });
    }
    return acc;
  }, []);
};

export const calculateItemSubtotals = (cartItems, bookMap) => {
  return cartItems.reduce((acc, item) => {
    const book = bookMap.get(item.bookId);
    if (!book) return acc;

    acc.push({
      bookId: item.bookId,
      price: book.price,
      quantity: item.quantity,
      subTotal: item.quantity * book.price,
    });

    return acc;
  }, []);
};

export const calculateTotalAmount = (items) => {
  return items.reduce((acc, item) => acc + item.subTotal, 0);
};
