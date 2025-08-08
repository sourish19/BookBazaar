# 📚 BookBazaar Backend API

A robust Node.js/Express.js backend API for an e-commerce book marketplace with integrated payment processing, user authentication, and comprehensive book management system.

## Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (Admin/User)
  - API key validation for enhanced security
  - Email verification system

- **Book Management**
  - CRUD operations for books
  - Book categorization and genre management
  - Image upload with Cloudinary integration
  - Stock management and availability tracking
  - Book reviews and ratings system

- **Shopping Cart System**
  - Add/remove items from cart
  - Cart persistence with user association
  - Real-time price calculations
  - Stock validation during cart operations

- **Order Management**
  - Order placement with shipping details
  - Order status tracking (pending → confirmed → shipped → delivered)
  - Order history and details retrieval
  - Pending order validation

- **Payment Integration**
  - Razorpay payment gateway integration
  - Secure payment verification with signature validation
  - Payment status tracking
  - Failed payment handling

- **Review System**
  - User reviews and ratings for books
  - Review validation and moderation
  - Average rating calculations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment Gateway**: Razorpay
- **Validation**: Express-validator
- **Error Handling**: Custom error middleware
- **Email Service**: Nodemailer (Mailtrap)

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.config.js    # Cloudinary configuration
│   └── razorpay.config.js      # Razorpay configuration
├── controllers/
│   ├── apiKey.controller.js    # API key management
│   ├── auth.controller.js      # Authentication operations
│   ├── book.controller.js      # Book CRUD operations
│   ├── cart.controller.js      # Cart management
│   ├── healthCheck.controller.js # Health check endpoint
│   ├── order.controller.js     # Order management
│   ├── payment.controller.js   # Payment processing
│   └── review.controller.js    # Review management
├── database/
│   └── index.db.js             # Database connection
├── middlewares/
│   ├── apiKey.middleware.js    # API key validation
│   ├── auth.middleware.js      # Authentication middleware
│   ├── errors.middleware.js    # Error handling
│   ├── multer.middleware.js    # File upload handling
│   ├── parseBook.middleware.js # Book data parsing
│   └── validationError.middleware.js # Validation error handling
├── models/
│   ├── api_key.model.js        # API key schema
│   ├── auth.model.js           # User schema
│   ├── books.model.js          # Book schema
│   ├── cart.model.js           # Cart schema
│   ├── orders.model.js         # Order schema
│   ├── payments.model.js       # Payment schema
│   └── reviews.model.js        # Review schema
├── routes/
│   ├── auth.route.js           # Authentication routes
│   ├── book.route.js           # Book routes
│   ├── cart.route.js           # Cart routes
│   ├── order.route.js          # Order routes
│   ├── payment.route.js        # Payment routes
│   └── review.route.js         # Review routes
├── utils/
│   ├── apiError.util.js        # Custom error class
│   ├── apiResponse.util.js     # Standardized response format
│   ├── asyncHandler.util.js    # Async error wrapper
│   ├── constants.util.js       # Application constants
│   ├── helper.util.js          # Utility functions
│   └── mail.util.js            # Email utilities
├── validators/
│   ├── auth.validator.js       # Authentication validation
│   ├── book.validator.js       # Book data validation
│   ├── cart.validator.js       # Cart validation
│   ├── order.validator.js      # Order validation
│   ├── payment.validator.js    # Payment validation
│   └── review.validator.js     # Review validation
├── public/
│   └── images/                 # Static image storage
├── app.js                      # Express app configuration
├── index.js                    # Server entry point
└── package.json                # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BookBazaar/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development

   # Database
   MONGODB_URI=mongodb://localhost:27017/bookbazaar

   # JWT Configuration
   AUTH_ACCESS_TOKEN_SECRET=your_access_token_secret
   AUTH_ACCESS_TOKEN_EXPIRY=1d
   AUTH_REFRESH_TOKEN_SECRET=your_refresh_token_secret
   AUTH_REFRESH_TOKEN_EXPIRY=10d

   # Email Configuration (Mailtrap)
   MAILTRAP_MAIL=your_email
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USERNAME=your_username
   MAILTRAP_PASSWORD=your_password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay Configuration
   RAZORPAY_API_KEY_ID=your_razorpay_key_id
   RAZORPAY_API_KEY_SECRET=your_razorpay_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## API Documentation

### Base URL

```
http://localhost:8000/api/v1/bookBazaar
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json
x-api-key: your_api_key

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json
x-api-key: your_api_key

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token

```http
POST /auth/refresh-token
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### Book Endpoints

#### Get All Books

```http
GET /books
x-api-key: your_api_key
```

#### Get Book by ID

```http
GET /books/:bookId
x-api-key: your_api_key
```

#### Create Book (Admin Only)

```http
POST /books
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: multipart/form-data

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "price": 299,
  "stock": 10,
  "genre": "fiction",
  "image": <file>
}
```

#### Update Book (Admin Only)

```http
PATCH /books/:bookId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

#### Delete Book (Admin Only)

```http
DELETE /books/:bookId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

### Cart Endpoints

#### Add Items to Cart

```http
POST /cart/add-cart-item
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "cartItems": [
    {
      "bookId": "book_id_here",
      "quantity": 2
    }
  ]
}
```

#### Get User Cart

```http
GET /cart/get-cart-items/:cartId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

#### Remove Item from Cart

```http
DELETE /cart/delete-cart-item/:cartId
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "bookId": "book_id_here"
}
```

#### Clear Cart

```http
DELETE /cart/delete-cart/:cartId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

### Order Endpoints

#### Place Order

```http
POST /order/place-order
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "items": [
    {
      "bookId": "book_id_here",
      "quantity": 2
    }
  ],
  "shippingDetails": {
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "phoneNumber": 1234567890
  }
}
```

#### List User Orders

```http
GET /order/list-orders
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

#### Get Order Details

```http
GET /order/order-details/:orderId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

### Payment Endpoints

#### Create Razorpay Order

```http
POST /payment/razorpay/create
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "orderId": "order_id_here"
}
```

#### Verify Payment

```http
POST /payment/razorpay/verify
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "paymentInfo": {
    "orderId": "order_id_here",
    "paymentId": "payment_id_here",
    "razorpayOrderId": "razorpay_order_id",
    "razorpayPaymentId": "razorpay_payment_id",
    "razorpaySignature": "razorpay_signature"
  }
}
```

#### Handle Failed Payment

```http
POST /payment/razorpay/failed
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "orderId": "order_id_here",
  "reason": "Payment failed reason"
}
```

### Review Endpoints

#### Add Review

```http
POST /review/add-review/:bookId
Authorization: Bearer <access_token>
x-api-key: your_api_key
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great book!"
}
```

#### Get Book Reviews

```http
GET /review/get-reviews/:bookId
x-api-key: your_api_key
```

#### Update Review

```http
PATCH /review/update-review/:reviewId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

#### Delete Review

```http
DELETE /review/delete-review/:reviewId
Authorization: Bearer <access_token>
x-api-key: your_api_key
```

## Authentication & Security

### JWT Tokens

- **Access Token**: Short-lived (1 day) for API access
- **Refresh Token**: Long-lived (10 days) for token renewal
- **API Key**: Required for all endpoints for additional security

### Middleware Stack

1. **API Key Validation**: Validates API key in headers
2. **Authentication**: Verifies JWT token and user session
3. **Authorization**: Checks user roles for protected routes
4. **Validation**: Validates request data using express-validator
5. **Error Handling**: Custom error middleware for consistent responses

## 💳 Payment Flow

1. **Order Placement**: User places order with items and shipping details
2. **Razorpay Order Creation**: Backend creates Razorpay order
3. **Payment Processing**: Frontend handles payment with Razorpay
4. **Payment Verification**: Backend verifies payment signature
5. **Order Confirmation**: Order status updated to confirmed

## 📊 Database Models

### User Model

- Authentication details
- Role-based access control
- Email verification status

### Book Model

- Book information (title, author, description)
- Pricing and stock management
- Genre categorization
- Image URLs

### Cart Model

- User association
- Book items with quantities
- Total bill calculation

### Order Model

- User and payment association
- Order items and shipping details
- Order and payment status tracking

### Payment Model

- Razorpay integration details
- Payment status and verification
- Error handling for failed payments

### Review Model

- User and book association
- Rating and comment system
- Timestamp tracking

## 🛡️ Error Handling

The API uses a centralized error handling system:

- **Custom Error Class**: `ApiError` for consistent error responses
- **Async Handler**: Wraps async functions to catch errors
- **Validation Errors**: Express-validator integration
- **HTTP Status Codes**: Proper status codes for different scenarios

## Email Integration

- **Mailtrap**: Development email testing
- **Email Verification**: User registration verification
- **Password Reset**: Secure password reset functionality

## File Upload

- **Multer**: File upload handling
- **Cloudinary**: Cloud image storage and optimization
- **Image Validation**: File type and size validation

## Testing

The API includes:

- **Health Check Endpoint**: `/health` for monitoring
- **Error Logging**: Comprehensive error tracking
- **Input Validation**: Robust data validation
- **Security Measures**: Multiple layers of security

## Environment Variables

| Variable                    | Description               | Required |
| --------------------------- | ------------------------- | -------- |
| `PORT`                      | Server port               | Yes      |
| `MONGODB_URI`               | MongoDB connection string | Yes      |
| `AUTH_ACCESS_TOKEN_SECRET`  | JWT access token secret   | Yes      |
| `AUTH_REFRESH_TOKEN_SECRET` | JWT refresh token secret  | Yes      |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name     | Yes      |
| `CLOUDINARY_API_KEY`        | Cloudinary API key        | Yes      |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret     | Yes      |
| `RAZORPAY_API_KEY_ID`       | Razorpay key ID           | Yes      |
| `RAZORPAY_API_KEY_SECRET`   | Razorpay secret key       | Yes      |
| `MAILTRAP_*`                | Email configuration       | Optional |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

**Built by Sourish 😊**
