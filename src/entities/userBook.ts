import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./user";
import { Book } from "./book";
import { UserBookStatus } from "../enums/userBookStatus";

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @ManyToOne(() => User, (user) => user.userBooks, { eager: true, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Book, (book) => book.userBooks, { eager: true, onDelete: "CASCADE" })
  book: Book;

  @Column({ type: 'enum', enum: UserBookStatus, default: UserBookStatus.BORROWED })
  status: UserBookStatus;

  @Column({ type: "timestamp", nullable: true })
  borrowDate: Date;

  @Column({ type: "timestamp", nullable: true })
  returnDate: Date | null;

  @Column({ type: "int", nullable: true })
  rating: number | null;

  constructor(user: User, book: Book, status: UserBookStatus, borrowDate: Date, returnDate?: Date, rating?: number) {
    this.user = user;
    this.book = book;
    this.status = status;
    this.borrowDate = borrowDate;
    this.returnDate = returnDate ?? null;
    this.rating = rating ?? null;
  }
}
