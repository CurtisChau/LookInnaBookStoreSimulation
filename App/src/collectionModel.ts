import { book } from "./book";

export interface collection {
  collectionName?: String;
  id: String;
  books: Array<book>;
}
