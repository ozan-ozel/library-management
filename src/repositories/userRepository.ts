import { AppDataSource } from '../datasource.config'; // Your DataSource instance
import { User } from '../entities/user';

export const userRepository = AppDataSource.getRepository(User).extend({
  async findUsersWithBooks() {
    return this.find({
      relations: ['userBooks', 'userBooks.book'], // Fetch related books
    });
  },

  async createUser(name: string): Promise<User> {
    const user = this.create({ name });
    return this.save(user);
  },
});
