import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../datasource.config'; // Import your data source
import { User } from '../entities/user'; // Import User entity
import { createUserSchema } from '../validations/createUser';
import { CreateUserDTO } from '@/dtos/CreateUserDTO';
import { UserService } from '@/services/user';
import { QueryFailedError } from 'typeorm';
import { returnBookSchema } from '@/validations/returnBook';

const userRepository = AppDataSource.getRepository(User);

/**
 * Create a new user.
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { error } = createUserSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message }); // Return validation error message
      return;
    }

    const createUserDTO = new CreateUserDTO(req.body.name);

    const user = userRepository.create(createUserDTO);
    await userRepository.save(user);

    res.status(201).json(user);
  } catch (error) {
    if(error instanceof QueryFailedError && error.message.includes('duplicate key value violates unique constraint')) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    next(error);
  }
};

/**
 * Get a list of users.
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userRepository.find();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(parseInt(id));

    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, bookId } = req.params;
    const { score } = req.body;

    const { error } = returnBookSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message }); // Return validation error message
      return;
    }

    const result = await UserService.returnBook(parseInt(userId), parseInt(bookId), score);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, bookId } = req.params;

    const result = await UserService.borrowBook(userId, bookId);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

