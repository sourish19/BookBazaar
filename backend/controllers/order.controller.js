import Order from '../models/orders.model.js';
import Books from '../models/books.model.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiError from '../utils/apiError.util.js';

const placeOrder = asyncHandler(async (req, res) => {
  const items = req.body?.items;

  if (!items || items.length <= 0)
    throw new ApiError([], 'Items not found ', 400);

  const itemsId = items.map((item) => {
    return item.bookId;
  });

  const book = await Books.find({
    _id: {
      $in: {
        itemsId,
      },
    },
  });

  if (!book || book.length <= 0) throw new ApiError([], 'Book not found', 404);

  const userOrder = await Order.findOne({ updet }); // Fix this
});

const listOrders = asyncHandler(async (req, res) => {});

const getOrderDetails = asyncHandler(async (req, res) => {});

export { placeOrder, listOrders, getOrderDetails };

/*
    User selects Book1 - 1, Book2 - 1, Book3 - 2
    clicks on placeOrder 
    Middleware check for jwt as well as apikey in headers 
    get user details from jwt 
    get book _id from frontend - use find to find multiple books 
    get the price and stock of books from db 
    check if the book is available and get its price and stock 
    check frontend and backend price and stock  
    if any book stock not available or price is different from frontend send a res to frontend review your cart  
    get user order db using user _id which we got from jwt middleware 
    use create for every order later we can use all the db data for that user to display order history  
    then send frontend a response it will redirect to payment route  

    After payment is done reduce the stock 
*/
