import {AppDataSource} from '../datasource.config'; // Your DataSource instance
import { Book } from '../entities/book';

export const bookRepository = AppDataSource.getRepository(Book).extend({
  async findBookById(bookId: number) {
    return this.findOne({
      where: { id: bookId },
      relations: ['userBooks', 'userBooks.user'],
    });
  },

  async createBook(name: string): Promise<Book> {
    const book = this.create({ name });
    return this.save(book);
  },

  async updateAverageRating(
    bookId: number,
    rating: number
  ): Promise<Book | null> {
    const book = await this.findOne({ where: { id: bookId } });
    if (!book) return null;

    book.totalRating += rating;
    book.borrowCount += 1;
    book.averageRating = book.totalRating / book.borrowCount;

    return this.save(book);
  },
});
