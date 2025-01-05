import { AppDataSource } from '../datasource.config'; // Your DataSource instance
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
});
