import Cart from '../models/cart.model.js';
import Books from '../models/books.model.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import {
  getInvalidItems,
  calculateItemSubtotals,
  calculateTotalAmount,
} from '../utils/helper.util.js';

const addItemToCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  const bookIds = cartItems.map((item) => item.bookId);

  // Find all the books based on the id which are in the bookIds array, If any bookId dosent exists in the db then it will skip it
  const fetchedBooks = await Books.find({ _id: { $in: bookIds } }).select(
    'stock price'
  );
  if (!fetchedBooks) throw new ApiError([], 'No Books found', 404);

  // Map each bookId with the book object from the db
  const bookMap = new Map();
  fetchedBooks.forEach((book) => bookMap.set(book._id.toString(), book));

  // Get all the invalidBooks
  const invalidItems = getInvalidItems(cartItems, bookMap);

  // Get individual book subTotal
  const validItemsWithSubtotal = calculateItemSubtotals(cartItems, bookMap);

  const totalAmount = calculateTotalAmount(validItemsWithSubtotal);

  const newCart = await Cart.create(
    {
      userId: req.user._id,
      books: validItemsWithSubtotal,
      bill: totalAmount,
    },
    { new: true }
  );

  res.status(201).json(
    new ApiResponse(201, 'Items added to cart successfully', {
      cartId: newCart._id,
      addedItems: validItemsWithSubtotal,
      invalidItems,
    })
  );
});

const getUserCart = asyncHandler(async (req, res) => {
  const userCart = await Cart.findOne({
    _id: req.params?.cartId,
    userId: req.user?._id,
  }).select('-userId');

  if (!userCart) throw new ApiError([], 'User cart not found', 403);

  res.status(200).json(
    new ApiResponse(200, 'Fetched User Cart Successfully', [
      {
        cartId: userCart._id,
        items: userCart.books,
        totalAmount: userCart.bill,
      },
    ])
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const deleteUserCart = await Cart.findOneAndDelete({
    _id: req.params?.cartId,
    userId: req.user?._id,
  }).select('-userId');

  if (!deleteUserCart) throw new ApiError([], 'User cart not found', 403);

  res.status(200).json(
    new ApiResponse(200, 'User Cart successfully deleted', [
      {
        cartId: deleteUserCart._id,
        items: deleteUserCart.books,
        totalAmount: deleteUserCart.bill,
      },
    ])
  );
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const userCartItem = await Cart.findOneAndUpdate(
    {
      _id: req.params?.cartId,
      userId: req.user?._id,
    },
    { $pull: { books: { bookId: req.body?.bookId } } },
    { new: true }
  ).select('-userId');

  if (!userCartItem) throw new ApiError([], 'User cart Item not found', 403);

  // Recalculate total amount after removing item
  const newTotalAmount = calculateTotalAmount(userCartItem.books);
  
  const updatedCart = await Cart.findByIdAndUpdate(
    userCartItem._id,
    { bill: newTotalAmount },
    { new: true }
  ).select('-userId');

  res.status(200).json(
    new ApiResponse(200, 'User Cart Item successfully deleted', [
      {
        cartId: updatedCart._id,
        items: updatedCart.books,
        totalAmount: updatedCart.bill,
      },
    ])
  );
});

export { addItemToCart, getUserCart, clearCart, removeItemFromCart };
