import { userRepository } from '@/repositories/userRepository';
import {
  UserBookDTO,
  userBookRepository,
} from '@/repositories/userBookRepository';
import { bookRepository } from '@/repositories/bookRepository';
import { UserBookStatus } from '@/enums/userBookStatus';
import redisClient from '@/redisClient';

export class UserService {
  /**
   * Get user details with past and present borrowed books.
   */
  static async getUserById(userId: number) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const returnedBooks = await userBookRepository.getReturnedUserBooks({
      userId,
    } as UserBookDTO);

    const borrowedBooks = await userBookRepository.getBorrowedUserBooks({
      userId,
    } as UserBookDTO);

    console.log('returnedBooks', returnedBooks);

    console.log('borrowedBooks', borrowedBooks);

    const pastBooks = returnedBooks
      .filter((r) => !borrowedBooks.some((b) => b.book.id === r.bookId))
      .map((ub) => ({
        name: ub.bookName,
        userScore: ub.rating,
      }));

    const presentBooks = borrowedBooks.map((ub) => ({
      name: ub.book.name,
    }));

    return {
      id: user.id,
      name: user.name,
      books: {
        past: pastBooks,
        present: presentBooks,
      },
    };
  }

  static async borrowBook(userId: string, bookId: string): Promise<any> {
    const user = await userRepository.findOne({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const book = await bookRepository.findOne({
      where: { id: parseInt(bookId) },
    });
    if (!book) {
      throw new Error('Book not found');
    }

    // Check if the book is already borrowed by the user
    const existingUserBook = await userBookRepository.findOne({
      where: {
        book: { id: parseInt(bookId) },
        status: UserBookStatus.BORROWED,
      },
    });

    if (existingUserBook) {
      throw new Error('Book is already borrowed');
    }

    await userBookRepository.borrowBook(parseInt(userId), parseInt(bookId));

    await redisClient.del(`book:${bookId}:details`);
  }

  static async returnBook(userId: number, bookId: number, score: number) {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const book = await bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new Error('Book not found');
    }

    // Check if the user has borrowed the book
    const userBook = await userBookRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
        status: UserBookStatus.BORROWED,
      },
      order: { id: 'DESC' },
    });

    if (!userBook) {
      throw new Error('Book not borrowed by this user');
    }

    await userBookRepository.returnBook(userBook, score);

    await redisClient.del(`book:${bookId}:details`);
  }
}
