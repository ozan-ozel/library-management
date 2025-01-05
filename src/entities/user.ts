import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { UserBook } from "./userBook";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

    // Relation to UserBook
    @OneToMany(() => UserBook, (userBook) => userBook.user)
    userBooks?: UserBook[];

  constructor(name: string) {
    this.name = name;
  }
}