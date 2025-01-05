import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm";
import { IsString, Length, Min } from "class-validator";
import { UserBook } from "./userBook";

@Entity()
export class Book {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  @Unique(["name"])
  @IsString()
  @Length(50, 255)  // MIN: 50, MAX: 255 characters
  name: string;

  @Column({ type: "float", default: 0.0 })
  @Min(0)
  averageRating: number;

  @Column({ type: "int", default: 0 })
  @Min(0)
  borrowCount: number;

  @Column({ type: "int", default: 0 })
  @Min(0)
  totalRating: number;

  // Relation to UserBook
  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks?: UserBook[];
  
  constructor(name: string, averageRating: number = 0, borrowCount: number = 0, totalRating: number = 0) {
    this.name = name;
    this.averageRating = averageRating;
    this.borrowCount = borrowCount;
    this.totalRating = totalRating;
  }
}