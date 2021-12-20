import { orders } from "../order";
import { userOrder } from "../userOrder";

export interface user {
  id: String;
  name: String;
  billing?: String;
  address?: String;
  role: number;
  orders: userOrder[];
}
