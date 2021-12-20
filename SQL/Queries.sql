/*All $ variables in queries represent inputs made from the user application*/

/*retrieves collection */
Select * from book,collection where book.id=collection.bookid

/*retrieve a list of id from collection*/
Select distinct id from collection

/*Note the above two queries are used to create an object in the application 
 to display the collection properly.Object is called collection in application
 collcetion:{name:collectionid,collectioName:name,books:[]}
*/



/*Retrieve the customer trying to log in */
Select * from customer Where customer.name=$1 and customer.password=$2

/*There are 4 different variations of this query based on the field, using string
 extrapolation in ts, I replaced the query text based on the inputed vield
*/
Select * from book where book.${req.body.field}=$1

Select * from book where book.publisher=$1

Select * from book where book.id=$1

Select * from book where book.genre=$1

Select * from book where book.publisher=$1

Select * from book where book.price=$1

Select * from book where book.pages=$1

Select * from book where book.author=$1

/*Inserts a new book into the collection*/
INSERT INTO collection(id,bookid,collection_name) VALUES($1,$2,$3)

/*retrieve books where the rows match*/
Select * from book Where book.id=$1

/*retrieves sales report by genre,publisher,author
repalce the fields with the request body to change what fields are being sent back
*/
Select distinct ${req.body.field},sales_by_${req.body.field}(book.${req.body.field}) from book

/*i.e*/

Select distinct genre,sales_by_genre(book.genre) from book

/*Retrieves all avaliable books*/
Select * from book

/*pays publisher and logs info to the adminlog table*/
Select pay_publisher_and_log($1)

/*retrieves the sum of all sales */
Select  sum(distinct sales_by_publisher(publisher.name)) from book inner join publisher on book.publisher=publisher.name

/*retrieves the sum of all sales times the publisher percentage, this equates to expenditure*/

Select  sum(distinct sales_by_publisher(publisher.name)*publisher.percentage) from book inner join publisher on book.publisher=publisher.name

/*retrieves all rows from the adminlog*/
Select * from adminlog

/*retrieves all rows from publisher*/
Select * from publisher

/*Deletes the selected book from collection*/
Delete from collection WHERE bookid=$1 and id=$2

/*retrieves the invoice where the customer id matches*/
Select * from invoice Where invoice.customer_id=$1

/*inserts a new invoice*/
INSERT INTO invoice(order_id,book_id,customer_id,number,billing,shipping) Values($1,$2,$3,$4,$5,$6)

/*takes the num of rows from invoice,this is to used to generate an order id*/
Select count(*) from invoice

