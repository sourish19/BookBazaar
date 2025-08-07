import express from 'express';
import cookieParser from 'cookie-parser';
import customErrorResponse from './middlewares/errors.middleware.js';

import authRoute from './routes/auth.route.js';
import bookRoute from './routes/book.route.js';
import reviewsRoute from './routes/review.route.js';
import cartRoute from './routes/cart.route.js';
import ordersRoute from './routes/order.route.js';
import paymentRoute from './routes/payment.route.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from public/images directory
app.use('/images', express.static('public/images'));

app.use('/api/v1/bookBazaar/auth', authRoute);
app.use('/api/v1/bookBazaar/books', bookRoute);
app.use('/api/v1/bookBazaar/review', reviewsRoute);
app.use('/api/v1/bookBazaar/cart', cartRoute);
app.use('/api/v1/bookBazaar/order', ordersRoute);
app.use('/api/v1/bookBazaar/payment', paymentRoute);

app.use(customErrorResponse);

export default app;
