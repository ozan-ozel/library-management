import redisClient from '@/redisClient';

import { bookRepository } from '@/repositories/bookRepository';
import {
  UserBookDTO,
  userBookRepository,
} from '@/repositories/userBookRepository';

export class BookService {
  /**
   * Get a book by ID with average score.
   */
  static async getBookById(bookId: number) {
    const cacheKey = `book:${bookId}:details`;

    const cachedBook = await redisClient.get(cacheKey);
    if (cachedBook) {
      console.log('Cache Hit');
      return JSON.parse(cachedBook); // Return cached data
    }

    // Find the book
    const book = await bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new Error('Book not found');
    }

    const bookRatings = await userBookRepository.getReturnedUserBooks({
      bookId,
    } as UserBookDTO);

    // Calculate average score
    const totalScore = bookRatings.reduce(
      (sum, bookRating) => sum + (bookRating.rating || 0),
      0
    );
    const ratingCount = bookRatings.filter((br) => br.rating !== null).length;
    const averageScore =
      ratingCount > 0 ? (totalScore / ratingCount).toFixed(2) : -1;

    // Store in Redis with a TTL
    await redisClient.set(
      cacheKey,
      JSON.stringify({
        id: book.id,
        name: book.name,
        score: averageScore,
      }),
      { EX: 3600 }
    ); // Cache for 1 hour

    return {
      id: book.id,
      name: book.name,
      score: averageScore,
    };
  }
}
