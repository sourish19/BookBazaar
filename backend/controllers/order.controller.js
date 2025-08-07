import Order from '../models/orders.model.js';
import Books from '../models/books.model.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import {
  getInvalidItems,
  calculateItemSubtotals,
  calculateTotalAmount,
} from '../utils/helper.util.js';

const placeOrder = asyncHandler(async (req, res) => {
  const items = req.body?.items; // it will be an array like this [{bookId,quantity},...]

  const prevPendingUserOrder = await Order.findOne({
    userId: req.body.user?._id,
    paymentStatus: 'pending',
  });

  if (prevPendingUserOrder)
    throw new ApiError([], 'Previous orders are still pending', 400);

  const bookIds = items.map((item) => {
    return item.bookId;
  });

  const fetchedBooks = await Books.find({
    _id: {
      $in: bookIds,
    },
  });

  const bookMap = new Map();
  fetchedBooks.forEach((book) => bookMap.set(book._id.toString(), book));

  // Get all the invalid books
  const invalidItems = getInvalidItems(items, bookMap);

  if (invalidItems.length > 0)
    throw new ApiError(invalidItems, 'Some books are invalid', 400);

  // Get the subTotal for every book in the items
  const validItemsWithSubtotal = calculateItemSubtotals(items, bookMap);

  // Get the totalAmout by adding the subTotals
  const totalAmount = calculateTotalAmount(validItemsWithSubtotal);

  const createOrder = await Order.create({
    userId: req.user?._id,
    totalAmount: totalAmount,
    items: validItemsWithSubtotal,
    itemCount: items.length,
    shippingDetails: req.body?.shippingDetails,
  });

  res.status(201).json(
    new ApiResponse(201, 'Order created successfully', {
      orderId: createOrder._id,
      items: validItemsWithSubtotal,
      totalAmount,
    })
  );
});

const listOrders = asyncHandler(async (req, res) => {
  const userOrders = await Order.find({ userId: req.body.user?._id })
    .sort({ createdAt: -1 }) //createdAt: -1 will return recent orders
    .select('-userId -paymentId');

  if (!userOrders || userOrders.length === 0) {
    throw new ApiError([], 'User orders not found', 404);
  }

  res.status(200).json(
    new ApiResponse(
      200,
      'Fetched User Orders Successfully',
      userOrders.map((item) => {
        return {
          orderId: item._id,
          itemCount: item.itemCount,
          items: item.items,
          shippingDetails: item.shippingDetails,
          paymentStatus: item.paymentStatus,
        };
      })
    )
  );
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const userOrder = await Order.findOne({
    _id: req.params?.orderId,
    userId: req.user?._id,
  }).select('-userId -paymentId');

  if (!userOrder) throw new ApiError([], 'No order found', 404);

  res.status(200).json(
    new ApiResponse(200, 'Fetched User Order Successfully', {
      orderId: userOrder._id,
      itemCount: userOrder.itemCount,
      items: userOrder.items,
      shippingDetails: userOrder.shippingDetails,
      paymentStatus: userOrder.paymentStatus,
    })
  );
});

export { placeOrder, listOrders, getOrderDetails };

/*
    Order First, then Payment approach
    Order controller - buy now 

    User clicks on buy now 
      frontend sends [{bookId,quantity},...]
      backend check isLoggedIn, isApiKeyValid from the Headers
      Validates bookId,quantity,price
      get the userId from req.user._id
      check if any order still exists in the Order model from that user  - check the order status - use .find() 
        -if pending, then throw error for not completing previous payment or cancle previous payment
        -if the database querry returns undefined then user dosent have any previous orders pending the proceede to next step
      get the array of bookOrder from body 
      destructure the bookIds from the array then find in the book db, are thouse books available 
        - if no book found or any book is missing throw error or else continue 
      get the stock of the book as well as price and totalAmount 
        - if the quantity is exceeding the stock of any book throw error or else continue 
      get the total amount and orderId - send the response to frontend 

    ---- Razorpay Integration ---- 
      Create a Razorpay instance in razorpay Utils 
      When user clicks pay then 
      hit this route  POST https://api.razorpay.com/v1/orders  from frontend 
      in the receipt parameter add the orderid which was previously received from frontend 


      {
        items: [
                {
                  bookId: 1234Abc,
                  quantity: 3
                }
              ],
        shippingDetails: {...}
      }

*/
