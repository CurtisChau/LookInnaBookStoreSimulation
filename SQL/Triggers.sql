
/*Trigger to restock books when it goes below 10, also logs to adminlog table to display to admin on application*/
CREATE FUNCTION public.restock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare amount NUMERIC;
declare publisher_email VARCHAR(90);
BEGIN

	Select invoice.number from invoice where invoice.book_id=new.id into amount;
	Select publisher.email from publisher,book where new.id=book.id and publisher.name=book.publisher into publisher_email;
    if(New.stock<=10) then
	Update book SET stock=new.stock+amount where new.id=book.id;
	Insert into adminlog (email,amount,timestamp)
	Values(publisher_email,amount, CURRENT_TIMESTAMP);
	
	END if;

	RETURN NEW;
END;
$$;

CREATE TRIGGER restock AFTER UPDATE ON public.book FOR EACH ROW EXECUTE FUNCTION public.restock();

/*Trigger to autmotically decrease stock when an invovice comes in*/
CREATE FUNCTION public.update_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

declare num_of_stock integer;
BEGIN
	Select stock from book where book.id=new.book_id into num_of_stock;
    UPDATE  book
	SET stock=(num_of_stock - new.number)
     where book.id=new.book_id;

           RETURN new;
END;
$$;

CREATE TRIGGER update_stock AFTER INSERT ON public.invoice FOR EACH ROW EXECUTE FUNCTION public.update_stock();