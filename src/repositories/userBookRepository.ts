import { AppDataSource } from '../datasource.config';
import { UserBook } from '../entities/userBook';

export const userBookRepository = AppDataSource.getRepository(UserBook).extend({
  async borrowBook(userId: number, bookId: number): Promise<UserBook> {
    const userBook = this.create({
      user: { id: userId },
      book: { id: bookId },
      status: 'borrowed',
      borrowDate: new Date(),
    });
    return this.save(userBook);
  },

  async returnBook(
    userId: number,
    bookId: number,
    rating: number
  ): Promise<UserBook | null> {
    const userBook = await this.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });
    if (!userBook) return null;

    userBook.status = 'returned';
    userBook.returnDate = new Date();
    userBook.rating = rating;

    return this.save(userBook);
  },
});
