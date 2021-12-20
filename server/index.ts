import express, { Application, Request, Response } from "express";
import envVarialbes from "./envVarialbes";
const cors = require("cors");
const app: Application = express();
const Pool = require("pg").Pool;
const corsOptions = "http://localhost:3001";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1011",
  port: 5432,
});

// Body parsing Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//user side queries
//user log in check if user is present
// user logged in, check order id
//display book collection
//make order

//for easy for access, assume two users and one admin

app.get("/start", async (_req, res) => {
  res.send("hello world ");
});

app.get("/collection", async (_req, res) => {
  let activeArray = [];
  try {
    const { rows } = await pool.query(
      "Select * from book,collection where book.id=collection.bookid "
    );
    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }
    res.send(activeArray);
  } catch (err) {
    console.log(err);
  }
});

app.get("/collectionId", async (_req, res) => {
  let activeArray = [];
  try {
    const { rows } = await pool.query("Select distinct id from collection");
    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }
    res.send(activeArray);
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  let activeArray = [];
  try {
    console.log(req.body);
    const { rows } = await pool.query(
      "Select * from customer Where customer.name=$1 and customer.password=$2",
      [req.body.name, req.body.password]
    );
    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }
    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/searchBook", async (req, res) => {
  let activeArray = [];
  try {
    console.log(req.body);

    const query_text = `Select * from book where book.${req.body.field}=$1`;

    const { rows } = await pool.query(query_text, [req.body.value]);

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }
    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/addToCollection", async (req, res) => {
  try {
    console.log(req.body);

    req.body?.bookIds.forEach(async (data: any) => {
      const { rows } = await pool.query(
        "INSERT INTO collection(id,bookid,collection_name) VALUES($1,$2,$3)",
        [req.body.collectionId, data, req.body.collectionName]
      );
    });
    res.send("success");
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

function numOfDuplicateArray(array: String[], id: String) {
  return array.filter((item) => item == id).length;
}

app.post("/book", async (req, res) => {
  try {
    const { rows } = await pool.query("Select * from book Where book.id=$1", [
      req.body.book_id,
    ]);

    res.send(rows[0].id);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/sales", async (req, res) => {
  let activeArray = [];
  try {
    console.log(req.body);
    let query_text = `Select distinct ${req.body.field},sales_by_${req.body.field}(book.${req.body.field}) from book`;

    console.log(query_text);
    const { rows } = await pool.query(query_text);

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }
    console.log(rows);
    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.get("/books", async (req, res) => {
  let activeArray = [];
  try {
    const { rows } = await pool.query("Select * from book");

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }

    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/paypublisher", async (req, res) => {
  try {
    console.log(req.body.publisher);

    const { rows } = await pool.query("Select pay_publisher_and_log($1)", [
      req.body.publisher,
    ]);

    res.send("Success");
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.get("/expenditure", async (req, res) => {
  let activeArray = [];

  try {
    const expense = await pool.query(
      "Select  sum(distinct sales_by_publisher(publisher.name)*publisher.percentage) from book inner join publisher on book.publisher=publisher.name"
    );

    const sales = await pool.query(
      "Select  sum(distinct sales_by_publisher(publisher.name)) from book inner join publisher on book.publisher=publisher.name"
    );

    console.log(expense.rows);
    console.log(sales.rows);
    activeArray.push({
      expense: expense.rows[0].sum,
      sales: sales.rows[0].sum,
    });
    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.get("/adminlogs", async (req, res) => {
  let activeArray = [];
  try {
    const { rows } = await pool.query("Select * from adminlog");

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }

    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.get("/publisher", async (req, res) => {
  let activeArray = [];
  try {
    const { rows } = await pool.query("Select * from publisher");

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }

    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/removeFromCollection", async (req, res) => {
  try {
    console.log(req.body);
    const { rows } = await pool.query(
      "Delete from collection WHERE bookid=$1 and id=$2",
      [req.body.bookid, req.body.collectionId]
    );

    res.send("Success");
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/invoice", async (req, res) => {
  let activeArray = [];
  try {
    console.log(req.body);
    const { rows } = await pool.query(
      "Select * from invoice Where invoice.customer_id=$1",
      [req.body.name]
    );

    for (let i = 0; i < rows.length; i++) {
      activeArray[i] = rows[i];
    }

    res.send(activeArray);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

app.post("/checkout", async (req, res) => {
  let activeArray: String[] = [];
  let queryArray: any[] = [];
  let filterArray: String[] = [];
  let numCount: number;
  let order_id: String = "";
  try {
    //add data then generate order id
    console.log(req.body);

    const query_text =
      "INSERT INTO invoice(order_id,book_id,customer_id,number,billing,shipping) Values($1,$2,$3,$4,$5,$6)";
    //find amount of duplicates first

    req.body.checkout.forEach((book: { id: any }) => {
      activeArray.push(book.id);
    });

    filterArray = [...new Set(activeArray)];

    filterArray.forEach((id) => {
      numCount = numOfDuplicateArray(activeArray, id);
      queryArray.push({ user: req.body.user, book_id: id, number: numCount });
    });

    console.log(queryArray);
    const { rows } = await pool.query("Select count(*) from invoice");
    order_id = String(Number(rows[0].count) + 1);

    queryArray.forEach(async (book: any) => {
      {
        await pool.query(query_text, [
          order_id,
          book.book_id,
          book.user,
          book.number,
          req.body.billing,
          req.body.shipping,
        ]);
      }
    });

    //if doesn't exist generate new

    console.log(order_id);
    res.send(order_id);
  } catch (err) {
    res.send("Failure");
    console.log(err);
  }
});

try {
  app.listen(envVarialbes.PORT, (): void => {
    console.log(`Connected successfully on port ${envVarialbes.PORT}`);
  });
} catch (error) {
  //console.error(`Error occured: ${error.message}`);
}
