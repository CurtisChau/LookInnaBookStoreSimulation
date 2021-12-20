import { roles } from "../roleEnum";
import { book } from "../book";
import { publisher } from "../publisher";
import { userOrder } from "../userOrder";
import { invetory } from "../inventory";
import axios from "axios";
import { action, computed, configure, observable } from "mobx";
import { collection } from "../collectionModel";

import { user } from "./user";
import { orders } from "../order";
import { logs } from "../logs";

configure({ enforceActions: "always" });

export default class DataStore {
  @observable
  invertoryArray: invetory[] = [];

  @observable
  publisherArray: publisher[] = [];

  @observable
  adminLogs: logs[] = [];

  @observable
  sales: any[] = [];

  @observable
  searchArray: book[] = [];

  @observable
  loggedInUser: user = {
    id: "default",
    name: "default",
    billing: "default",
    address: "default",
    role: -1,
    orders: [],
  };

  @observable
  checkoutArray: book[] = [];

  @observable
  allBooks: book[] = [];

  @observable
  loggedIn: boolean = false;

  @observable
  collectionMap: collection[] = [];

  @observable x: number = 3;

  @computed
  get getAdminLogs() {
    return this.adminLogs;
  }

  @computed
  get getPublisherArray() {
    return this.publisherArray;
  }

  @action.bound
  logOut() {
    if (this.loggedIn) {
      this.loggedIn = false;
    }
  }

  @action.bound
  addAdminLogs(log: logs) {
    this.adminLogs.push(log);
  }

  @action.bound
  clearAdminLogs() {
    this.adminLogs = [];
  }

  @action.bound
  pushPublisherArray(publisher: publisher) {
    this.publisherArray.push(publisher);
  }

  @action.bound
  clearPublisherArray() {
    this.publisherArray = [];
  }

  @computed
  get getSearchArray() {
    return this.searchArray;
  }

  @action.bound
  pushSearch(book: book) {
    this.searchArray.push(book);
  }

  @action.bound
  resetSearchArray() {
    this.searchArray = [];
  }

  @action.bound
  addAllBookArray(book: book) {
    this.allBooks.push(book);
  }

  @computed
  get getSalesArray() {
    return this.sales;
  }

  @action.bound
  pushSales(value: any) {
    this.sales.push(value);
  }

  @computed
  get getAllBookArray() {
    return this.allBooks;
  }

  @action.bound
  addOrderTo(index: number, order: orders) {
    if (this.loggedIn && this.loggedInUser.orders.length > 0) {
      this.loggedInUser.orders[index].orders.push(order);
    }
  }

  @action.bound
  clearUserOrder() {
    if (this.loggedIn) {
      this.loggedInUser.orders = [];
    }
  }

  @action.bound
  clearBookArray() {
    this.allBooks = [];
  }

  @action.bound
  clearCheckOut() {
    this.checkoutArray = [];
  }

  @action.bound
  clearCollection() {
    this.collectionMap = [];
  }

  @action.bound
  updateUserOrder(order: userOrder) {
    if (this.loggedIn) {
      this.loggedInUser.orders.push(order);
    }
  }

  @computed
  get getCheckoutArray() {
    return this.checkoutArray;
  }

  @computed
  get getUserOrderArray() {
    return this.loggedInUser.orders;
  }

  @action.bound
  addInventory(inventory: invetory) {
    console.log(inventory);
    this.invertoryArray.push(inventory);
  }

  @action.bound
  getStock(bookId: String): number {
    return this.invertoryArray.findIndex((element) => element.book === bookId);
  }

  @computed
  get getInvetoryArray() {
    return this.invertoryArray;
  }

  @action.bound
  removeFromArray(bookid: String, index: number) {
    this.reduceStock(bookid, false);
    this.checkoutArray.splice(index, 1);
  }

  @action.bound
  addToCheckOut(book: book) {
    console.log("ADDING THIS" + book);
    //also reduce stock
    this.reduceStock(book.id, true);
    this.checkoutArray.push(book);
  }

  @action.bound
  setLoggedInUser(user: user) {
    this.loggedIn = true;
    this.loggedInUser = user;
  }

  @action.bound
  userloggedIn() {
    console.log(this.loggedIn);
    this.loggedIn = !this.loggedIn;
  }

  @computed
  get getLoggedInUser() {
    return this.loggedInUser;
  }

  @computed
  get getLoggedIn() {
    return this.loggedIn;
  }

  @action.bound
  addEntry(entry: collection) {
    this.collectionMap.push(entry);
  }

  @action.bound
  reduceStock(bookId: String, addOrReduce: boolean) {
    this.invertoryArray.forEach((element, index) => {
      if (bookId === element.book) {
        console.log("reducing");
        this.invertoryArray[index].stock = addOrReduce
          ? this.invertoryArray[index].stock - 1
          : this.invertoryArray[index].stock + 1;
      }
    });
    console.log(this.invertoryArray);
  }

  @action.bound
  clearSalesArray() {
    this.sales = [];
  }

  @action.bound
  addBookArray(index: number, book: book) {
    this.collectionMap[index].books.push(book);
  }

  @action.bound
  async payPublisher(publisher: String) {
    try {
      await axios.post("http://localhost:3000/paypublisher", {
        publisher: publisher,
      });
      //request then update again
      this.clearPublisherArray();
      await this.requestPublisher();
      this.clearAdminLogs();
      await this.requestAdminLogs();
    } catch (err) {
      console.log(err);
    }
  }
  @action.bound
  modifyEntry(index: number, collectionName: String) {
    console.log(collectionName);
    this.collectionMap[index].collectionName = collectionName;
  }

  @action.bound
  async requestAdminLogs() {
    try {
      const reponse = await axios.get("http://localhost:3000/adminlogs");

      reponse.data?.forEach((logs) => {
        this.addAdminLogs({
          email: logs.email,
          amount: logs?.amount,
          timeStamp: logs.timestamp,
          paid: logs?.paid,
        });
      });
      console.log(this.getAdminLogs);
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async requestPublisher() {
    try {
      const response = await axios.get("http://localhost:3000/publisher");
      response.data?.forEach((publisher) => {
        this.pushPublisherArray({
          name: publisher.name,
          account: publisher.account,
          email: publisher.email,
          money: publisher.money,
          percentage: publisher.percentage,
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async searchBooks(field: String, value: String | number) {
    try {
      let searchValue = value;
      if (field === "price" || field === "pages") {
        console.log("conversion");
        searchValue = Number(value);
      }
      const response = await axios.post("http://localhost:3000/searchBook", {
        field: field,
        value: searchValue,
      });
      this.resetSearchArray();
      response.data?.forEach((element) => {
        this.pushSearch({
          id: element.bookid,
          price: element.price,
          pages: element.pages,
          author: element.author,
          genre: element.genre,
          stock: element.stock,
          name: element.name,
          publisher: element.publisher,
        });
      });
      console.log(this.searchArray);
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async requestSalesReport(field: String) {
    let response;
    try {
      //clear sales
      this.clearSalesArray();
      console.log("sales called");
      if (field === "expenses") {
        console.log("SPEICAL EXPENSES");
        response = await axios.get("http://localhost:3000/expenditure");
      } else {
        response = await axios.post("http://localhost:3000/sales", {
          field: field,
        });
      }
      console.log(response.data);
      response.data?.forEach((data) => {
        this.pushSales(data);
      });
      console.log(this.sales);
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async removeBookFromCollection(bookid: String, collectionId: String) {
    try {
      const response = await axios.post(
        "http://localhost:3000/removeFromCollection",
        {
          bookid: bookid,
          collectionId: collectionId,
        }
      );
      console.log(response);
      this.clearCollection();
      this.clearBookArray();
      await this.init();
      console.log(this.collectionMap);
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async addBooksToCollection(
    values: String[],
    collectionId: String,
    collectionName?: String
  ) {
    try {
      if (values.length > 0) {
        console.log("calleddasdsadsa");
        const response = await axios.post(
          "http://localhost:3000/addToCollection",
          {
            bookIds: values,
            collectionId: collectionId,
            collectionName: collectionName,
          }
        );
        console.log(response);
        this.clearCollection();
        await this.requestCollection();
        console.log("this value", this.collectionMap);
      }
      //refresh
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async sendCheckoutArray(billing: String, shipping: String, same: boolean) {
    console.log(
      `Sending checkout array with ${this.checkoutArray.length} elements in it`
    );

    console.log(`Sending ${billing} and ${shipping}`);
    console.log(same);

    if (this.checkoutArray.length > 0) {
      const response = await axios.post("http://localhost:3000/checkout", {
        checkout: this.checkoutArray,
        user: this.loggedInUser.id,
        billing: same ? this.loggedInUser.billing : billing,
        shipping: same ? this.loggedInUser.address : shipping,
      });

      console.log(response.data);
      //then refresh
      this.clearUserOrder();
      await this.requestUserOrders();
      this.clearCollection();
      await this.requestCollection();
      //clear
      this.clearCheckOut();
    }
  }

  @action.bound
  async addNewBookEntry(
    name: String,
    id: String,
    pages: number,
    price: number,
    author: String,
    genre: String,
    publisher: String,
    stock: number
  ) {
    try {
      await axios.post("http://localhost:3000/addabook", {
        id: id,
        price: price,
        pages: pages,
        author: author,
        name: name,
        genre: genre,
        stock: stock,
        publisher: publisher,
      });

      this.clearBookArray();
      await this.requestBooks();
    } catch (err) {
      console.log(err);
    }
  }

  @action.bound
  async requestLogin(name: String, password: String) {
    console.log(`Sending ${name} + ${password}`);
    const response = await axios.post("http://localhost:3000/user", {
      name: name,
      password: password,
    });
    if (response.data?.length !== 0) {
      response.data?.forEach((element) => {
        this.setLoggedInUser({
          id: element.id,
          billing: element?.billing,
          address: element?.shippping,
          name: element.name,
          role: element.role,
          orders: [],
        });
      });
    }
    //clear first then request
    this.clearUserOrder();
    await this.requestUserOrders();

    if (Number(this.loggedInUser.role) === roles.admin) {
      this.clearAdminLogs();
      this.clearPublisherArray();
      await this.requestAdminLogs();
      await this.requestPublisher();
    }

    console.log("retrieving orders" + this.loggedInUser.orders);
  }

  @action.bound
  async requestUserOrders() {
    if (this.loggedIn) {
      //if user present retrieve all order data
      const response = await axios.post("http://localhost:3000/invoice", {
        name: this.loggedInUser.id,
      });

      let orderIndex: number;
      console.log(response.data);

      if (response.data.length > 0) {
        response.data?.forEach((data, index) => {
          orderIndex = this.loggedInUser.orders.findIndex(
            (element) => element.id === data.order_id
          );
          if (orderIndex >= 0) {
            //exist  find the existing object then push
            this.addOrderTo(orderIndex, {
              book_id: data.book_id,
              amount: data.number,
              billing: data?.billing,
              Shipping: data?.shipping,
            });
          } else {
            //add new entry then add the corresponding element
            this.updateUserOrder({
              id: data.order_id,
              orders: [
                {
                  book_id: data.book_id,
                  amount: data.number,
                  billing: data?.billing,
                  Shipping: data?.shipping,
                },
              ],
            });
          }
        });
      }
      //then plaster to order array
    }
    console.log(this.loggedInUser.orders);
  }

  @action.bound
  async requestCollection() {
    try {
      const response = await axios.get("http://localhost:3000/collectionId");

      response.data?.forEach((element: { id: any }) => {
        this.addEntry({ id: element.id, books: [] });
      });

      const collectionResponse = await axios.get(
        "http://localhost:3000/collection"
      );

      let idArray: String[] = [];
      collectionResponse.data.forEach((element: any) => {
        //find index of that

        this.addBookArray(
          this.collectionMap.findIndex((item) => {
            if (item.id === element.id) return true;
          }),
          {
            id: element.bookid,
            price: element.price,
            pages: element.pages,
            author: element.author,
            genre: element.genre,
            stock: element.stock,
            name: element.name,
            publisher: element.publisher,
          }
        );

        console.log(element);

        this.addInventory({
          book: element.bookid,
          stock: Number(element.stock),
        });

        this.modifyEntry(
          this.collectionMap.findIndex((item) => {
            if (item.id === element.id) return true;
          }),
          element.collection_name
        );
      });
    } catch (err) {}
  }

  @action.bound
  async init() {
    /*  let response = await fetch(this.todoAPI);
    let newToDos: ToDoModel[] = await response.json();
    this.addToDoToStore(newToDos);*/
    try {
      await this.requestCollection();

      await this.requestBooks();
      //get publisher

      //get admin logs

      console.log(this.collectionMap);
    } catch (err: any) {
      console.log(err);
    }
  }

  @action.bound
  async requestBooks() {
    try {
      const bookResponse = await axios.get("http://localhost:3000/books");

      bookResponse.data?.forEach((book) => {
        this.addAllBookArray({
          id: book.id,
          price: book.price,
          pages: book.pages,
          author: book.author,
          genre: book.genre,
          stock: book.stock,
          name: book.name,
          publisher: book.publisher,
        });
      });
      //get publisher

      //get admin logs

      console.log(this.collectionMap);
    } catch (err: any) {
      console.log(err);
    }
  }

  @action.bound
  increase() {
    this.x++;
  }

  @action.bound
  getNu() {
    return this.x;
  }

  @action.bound
  getCollectionMap() {
    return this.collectionMap;
  }
}
