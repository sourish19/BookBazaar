import express from 'express';
import cookieParser from 'cookie-parser';
import customErrorResponse from './middlewares/errors.middleware.js';

import userRoute from './routes/user.route.js';
import bookRoute from './routes/book.route.js';
import reviewsRoute from './routes/review.route.js';
import ordersRoute from './routes/order.route.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', userRoute);
app.use('/api/v1/books', bookRoute);
app.use('/api/v1', reviewsRoute);
app.use('/api/v1', ordersRoute);

app.use(customErrorResponse);

export default app;
