import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../datasource.config';
import { Book } from '../entities/book';
import { createBookSchema } from '../validations/createBook';
import { CreateBookDTO } from '@/dtos/CreateBookDTO';
import { BookService } from '../services/book';
import { QueryFailedError } from 'typeorm';
import { ListBookDTO } from '@/dtos/ListBookDTO';

const bookRepository = AppDataSource.getRepository(Book);

/**
 * Create a new book.
 */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const { error } = createBookSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const createBookDTO = new CreateBookDTO(req.body.name);

    const book = bookRepository.create(createBookDTO);
    await bookRepository.save(book);

    res.status(201).json(book);
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      error.message.includes('duplicate key value violates unique constraint')
    ) {
      res.status(400).json({ error: 'Book already exists' });
      return;
    }

    next(error);
  }
};

/**
 * Get a list of all books.
 */
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const books = await bookRepository.find(); // Get all books
    res.status(200).json(books.map((book) => new ListBookDTO(book)));
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Call the service method
    const book = await BookService.getBookById(parseInt(id));

    res.status(200).json(book);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
