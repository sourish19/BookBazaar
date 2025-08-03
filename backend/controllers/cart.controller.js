import CartItems from '../models/cart.model.js';
import Books from '../models/books.model.js';
import asyncHandler from '../utils/asyncHandler.util.js';
import ApiError from '../utils/apiError.util.js';

const addItemToCart = asyncHandler(async (req, res) => {
  const { userId, requestedBooks } = req.body;

  if(userId !== req.user?._id)
    throw new ApiError([],"Invalid User",404)

  const bookIds = requestedBooks.map((ids) => {
    return ids.bookId;
  });

  const booksFromDb = await Books.find({ _id: { $in: bookIds } }).select(
    'stock price'
  ); // Find all the books based on the id which are in the bookIds array

  if(!booksFromDb)
    throw new ApiError([],"No Books found",404)

  const mapBooks = new Map()

  booksFromDb.map(item=>{
    mapBooks.set(item._id.toString(),item)
  })

// *****  Complete this later *****

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

    frontend will send the data like this 
        {
            userId: 123456,
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
            Find all the books from Books db -- Book.find() & also use $gte for quantity 
            Now use filter to check which bookId != req.body.books.bookId -- return those bookId which is not there in the backend or which stock is not there 
            
            -- Use Map for better optimization 

*/
