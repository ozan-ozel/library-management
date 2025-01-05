import express from 'express';
import {
  borrowBook,
  createUser,
  getUserById,
  getUsers,
  returnBook,
} from '@/controllers/user';

const router = express.Router();

router.post('/', createUser);

router.get('/:id', getUserById);

router.get('/', getUsers);

router.post('/:userId/borrow/:bookId', borrowBook);

router.post('/:userId/return/:bookId', returnBook);

export default router;
