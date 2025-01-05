import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';

import { UserBook } from './userBook';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @Unique(['name'])
  name: string;

  // Relation to UserBook
  @OneToMany(() => UserBook, (userBook) => userBook.user)
  userBooks?: UserBook[];

  constructor(name: string) {
    this.name = name;
  }
}
