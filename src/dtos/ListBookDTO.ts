import { Book } from "@/entities/book";

export class ListBookDTO {
  id: number;
  name: string;

  constructor(book: Book) {
    this.id = book.id;
    this.name = book.name;
  }
}