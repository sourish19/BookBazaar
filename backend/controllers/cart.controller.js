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
    userId: req.user._id,
    books: validItemsWithSubtotal,
    bill: totalAmount,
  });

  res.status(201).json(
    new ApiResponse(201, 'Items added to cart successfully', {
      addedItems: validItemsWithSubtotal,
      invalidItems,
    })
  );
});

const getUserCart = asyncHandler(async (req, res) => {});

const clearCart = asyncHandler(async (req, res) => {});

const removeItemFromCart = asyncHandler(async (req, res) => {});

export { addItemToCart, getUserCart, clearCart, removeItemFromCart };

/*  
--- addToCart functionality 
    User click on add to cart in one Item 
    Item goes to cart with only quantity by default is 1 

    Anybody can bypass frontend and can change price or bill so it is not secure or required to send these teo data 

    Same way user clicks on multiple Items and also increases the quantity 
    Frontend will limit the amount of quantity based on the quantity displayed in the frontend -- not accurate, need to also check in Backend
    if book not found throw error

    userId will be in cookies or api key in headers 
    frontend will send the data like this 
        {
            requestedBooks:[{
                bookId: 123456ABCD,
                quantity: 5
            },
            {
                bookId: 123456KLZX,
                quantity: 1
            },
            {
                bookId: 123456OPAS,
                quantity: 3
            }]  
        }
    Backend will check the stock if there is any diff the will throw err 
    And it will calculate the bill and will send the response 
    If there is diff b/w frontend bill & backend bill -- then frontend will replace the data which was received from backend 

--- Partial Accept for stock flow
    Get the bookId 
    Check If all book exists 
        If all book exists continue 
        No Book exists - throw error 
        If only one book exists but rest dosent exists -- partially continue
            Now use filter to check which bookId != req.body.books.bookId -- return those bookId which is not there in the backend or which stock is not there 
            
            -- Use Map for better optimization 

*/
