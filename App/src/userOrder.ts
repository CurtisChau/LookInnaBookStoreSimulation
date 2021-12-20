import { book } from "./book";
import { orders } from "./order";

export interface userOrder {
  id: String;
  orders: orders[];
}
