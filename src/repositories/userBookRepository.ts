import { UserBookStatus } from '@/enums/userBookStatus';
import { AppDataSource } from '../datasource.config';
import { UserBook } from '../entities/userBook';

export interface UserBookDTO {
  userId: number;
  bookId: number;
}

export const userBookRepository = AppDataSource.getRepository(UserBook).extend({
  async borrowBook(userId: number, bookId: number): Promise<UserBook> {
    const userBook = this.create({
      user: { id: userId },
      book: { id: bookId },
      status: UserBookStatus.BORROWED,
      borrowDate: new Date(),
    });
    return this.save(userBook);
  },

  async getBorrowedUserBooks({ userId, bookId }: UserBookDTO): Promise<any[]> {
    return this.find({
      where: {
        user: { id: userId },
        book: { id: bookId },
        status: UserBookStatus.BORROWED,
      },
    });
  },

  async getReturnedUserBooks({ userId, bookId }: UserBookDTO): Promise<any[]> {
    const query = this.createQueryBuilder('ub')
      .select([
        'ub."userId" AS "userId"',
        'ub."bookId" AS "bookId"',
        'book.name AS "bookName"',
        'ub.rating AS rating',
        'ub."returnDate" AS returnDate',
      ])
      .innerJoin('ub.book', 'book') // Join the book table to get book details
      .where('ub.status = :status', { status: UserBookStatus.RETURNED })
      .andWhere('ub.rating IS NOT NULL'); // Only include returned books with ratings

    // Conditional `AND` filter based on the `userId`
    if (userId) {
      query.andWhere('ub."userId" = :userId', { userId });
    }

    // Conditional `AND` filter based on the `bookId`
    if (bookId) {
      query.andWhere('ub."bookId" = :bookId', { bookId });
    }

    return query
      .andWhere(
          `(ub.returnDate) = (
        SELECT MAX(sub_ub."returnDate")
        FROM user_book sub_ub
        WHERE sub_ub."userId" = ub."userId"
        AND sub_ub."bookId" = ub."bookId"
        AND sub_ub.status = :status
      )`,
        { status: UserBookStatus.RETURNED }
      ) // Subquery to get the latest return date for each user-book combination
      .getRawMany();
  },

  async returnBook(
    userBook: UserBook,
    rating: number
  ): Promise<UserBook | null> {
    userBook.status = UserBookStatus.RETURNED;
    userBook.returnDate = new Date();
    userBook.rating = rating;

    return this.save(userBook);
  },
});
