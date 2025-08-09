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

  const newCart = await Cart.create({
    userId: req.user?._id,
    books: validItemsWithSubtotal,
    bill: totalAmount,
  });
  console.log(newCart);

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
  // Check if the book exists in the cart
  const userCart = await Cart.findOne({
    _id: req.params?.cartId,
    userId: req.user?._id,
    books: { $elemMatch: { bookId: req.body?.bookId } },
  }).select('-userId');

  if (!userCart) {
    throw new ApiError([], 'User cart item not found', 403);
  }

  // Step 2: Prepare updated books array and new bill
  const updatedBooks = userCart.books.filter(
    (b) => b.bookId.toString() !== req.body?.bookId
  );
  const newTotalAmount = calculateTotalAmount(updatedBooks);

  // Update cart 
  const updatedCart = await Cart.findOneAndUpdate(
    {
      _id: req.params?.cartId,
      userId: req.user?._id,
    },
    {
      $pull: { books: { bookId: req.body?.bookId } },
      $set: { bill: newTotalAmount },
    },
    { new: true }
  ).select('-userId');

  res.status(200).json(
    new ApiResponse(200, 'User cart item successfully deleted', [
      {
        cartId: updatedCart._id,
        items: updatedCart.books,
        totalAmount: updatedCart.bill,
      },
    ])
  );
});


export { addItemToCart, getUserCart, clearCart, removeItemFromCart };
