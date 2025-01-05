import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user';
import bookRouter from './routes/book';
import { AppDataSource } from './datasource.config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/users', userRouter);
app.use('/books', bookRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data source initialized');
  })
  .catch((err) => {
    console.error('Data source initialization error:', err);
  });

export default app;
