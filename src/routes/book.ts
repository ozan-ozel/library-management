import { createBook, getAllBooks, getBookById } from '@/controllers/book';
import express from 'express';

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

export default router;
