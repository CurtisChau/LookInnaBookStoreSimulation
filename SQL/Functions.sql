/* This function is intended for admin to pay the publisher and loggin the payment to adminlog table*/
CREATE FUNCTION public.pay_publisher_and_log(pname character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$declare
   amount_owned numeric;
   current_amount numeric;
   email Varchar(90);
begin
   Select pay_publisher(pname) into amount_owned;
   Select publisher.money from publisher where publisher.name=pname into current_amount;
   Select publisher.email from publisher where publisher.name=pname into email;
   Update publisher set money=(current_amount+amount_owned) where publisher.name=pname;
   Insert into adminlog(email,timestamp,paid) Values(email,Current_Timestamp,amount_owned);
   
   return ;
end;
$$;

/*This function is intended to calculate the amount due to publishers from the invovice table*/

CREATE FUNCTION public.pay_publisher(pname character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
declare
   total_sales_by_publisher numeric;
   publisher_percentage numeric;
begin
   Select sales_by_publisher(pname) from book into total_sales_by_publisher;
   Select publisher.percentage from publisher where pname=publisher.name into publisher_percentage;
   
   return total_sales_by_publisher*publisher_percentage;
end;
$$;
/*This function is intended to generate a sales report by author*/
CREATE FUNCTION public.sales_by_author(cname character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
declare
   result numeric(10,2);
begin 
	Select SUM(book.price * invoice.number) into result from invoice,book
	where book.id=invoice.book_id and book.author=cname;
	return result;
end;
   
$$;

/*This function is intended to generate a sales report by genre*/
CREATE FUNCTION public.sales_by_genre(cname character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$ 
declare result numeric(10,2);

begin 
	Select SUM(book.price * invoice.number) into result from invoice,book
	where book.id=invoice.book_id and book.genre=cname;
	return result;
end;
$$;

/*This function is intended to generate a sales report by publisher*/
CREATE FUNCTION public.sales_by_publisher(cname character varying) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
declare result numeric(10,2);
begin
Select SUM(book.price * invoice.number) into result from invoice,book
	where book.id=invoice.book_id and book.publisher=cname;
	return result;
end;
$$;


