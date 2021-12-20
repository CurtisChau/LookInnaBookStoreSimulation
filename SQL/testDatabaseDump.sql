--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2021-12-19 00:11:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3173 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';



--
-- TOC entry 269 (class 1255 OID 25095)
-- Name: pay_publisher_and_log(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.pay_publisher_and_log(pname character varying) OWNER TO postgres;

--
-- TOC entry 267 (class 1255 OID 25089)
-- Name: restock(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.restock() OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 25068)
-- Name: sales_by_author(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.sales_by_author(cname character varying) OWNER TO postgres;

--
-- TOC entry 265 (class 1255 OID 24786)
-- Name: sales_by_genre(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.sales_by_genre(cname character varying) OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 25074)
-- Name: sales_by_publisher(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.sales_by_publisher(cname character varying) OWNER TO postgres;

--
-- TOC entry 249 (class 1255 OID 25066)
-- Name: update_stock(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION public.update_stock() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;





--
-- TOC entry 246 (class 1259 OID 25075)
-- Name: adminlog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adminlog (
    email character varying,
    amount numeric,
    "timestamp" timestamp with time zone,
    paid numeric
);


ALTER TABLE public.adminlog OWNER TO postgres;




--
-- TOC entry 237 (class 1259 OID 24727)
-- Name: book; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book (
    id character varying NOT NULL,
    price numeric,
    pages numeric,
    author character varying,
    name character varying,
    genre character varying,
    stock numeric NOT NULL,
    publisher character varying
);


ALTER TABLE public.book OWNER TO postgres;






CREATE TABLE public.collection (
    id character varying NOT NULL,
    bookid character varying NOT NULL,
    collection_name character varying
);


ALTER TABLE public.collection OWNER TO postgres;



--
-- TOC entry 236 (class 1259 OID 24722)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    name character varying,
    id character varying NOT NULL,
    billing character varying,
    shipping character varying,
    role "char",
    password character varying
);


ALTER TABLE public.customer OWNER TO postgres;













CREATE TABLE public.invoice (
    order_id character varying NOT NULL,
    customer_id character varying NOT NULL,
    book_id character varying NOT NULL,
    number numeric,
    billing character varying,
    shipping character varying
);


ALTER TABLE public.invoice OWNER TO postgres;







--
-- TOC entry 239 (class 1259 OID 24762)
-- Name: publisher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publisher (
    name character varying NOT NULL,
    account character varying,
    email character varying,
    money numeric,
    percentage numeric
);


ALTER TABLE public.publisher OWNER TO postgres;


--
-- TOC entry 3167 (class 0 OID 25075)
-- Dependencies: 246
-- Data for Name: adminlog; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', 3, '2021-12-18 19:00:55.28716-05', NULL);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('penguinbooks@gmail.com', NULL, '2021-12-18 19:07:30.466535-05', 448.000);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', NULL, '2021-12-18 19:07:36.793511-05', 810.000);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', 3, '2021-12-18 21:36:58.748493-05', NULL);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('penguinbooks@gmail.com', NULL, '2021-12-18 21:38:02.141713-05', 448.000);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', NULL, '2021-12-18 21:38:06.146375-05', 990.000);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('penguinbooks@gmail.com', NULL, '2021-12-18 21:44:54.509879-05', 448.000);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', 2, '2021-12-18 21:49:23.135017-05', NULL);
INSERT INTO public.adminlog (email, amount, "timestamp", paid) VALUES ('lionbooks@gmail.com', 2, '2021-12-18 21:49:23.135017-05', NULL);





--
-- TOC entry 3158 (class 0 OID 24727)
-- Dependencies: 237
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.book (id, price, pages, author, name, genre, stock, publisher) VALUES ('3', 120, 25, 'fgdf', 'book3', 'fiction', 18, 'Penguin books');
INSERT INTO public.book (id, price, pages, author, name, genre, stock, publisher) VALUES ('4', 50, 30, 'pdt', 'book4', 'history', 22, 'Penguin books');
INSERT INTO public.book (id, price, pages, author, name, genre, stock, publisher) VALUES ('1', 100, 10, 'd', 'book1', 'action', 11, 'Lion books');
INSERT INTO public.book (id, price, pages, author, name, genre, stock, publisher) VALUES ('2', 50, 100, 's', 'book2', 'genre', 12, 'Lion books');














--
-- TOC entry 3161 (class 0 OID 24767)
-- Dependencies: 240
-- Data for Name: collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.collection (id, bookid, collection_name) VALUES ('1', '1', 'action');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('2', '2', 'fantasy');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('2', '1', 'fantasy');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('2', '3', 'action');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('2', '4', 'fantasy');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('1', '2', 'action');
INSERT INTO public.collection (id, bookid, collection_name) VALUES ('1', '3', 'action');





--
-- TOC entry 3157 (class 0 OID 24722)
-- Dependencies: 236
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.customer (name, id, billing, shipping, role, password) VALUES ('m', '1', 'x', 'x', '0', '123');
INSERT INTO public.customer (name, id, billing, shipping, role, password) VALUES ('a', '2', 'x', 'x', '0', '123');
INSERT INTO public.customer (name, id, billing, shipping, role, password) VALUES ('s', '3', 'x', 'x', '1', '123');







--
-- TOC entry 3159 (class 0 OID 24747)
-- Dependencies: 238
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('1', '1', '1', 3, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('1', '1', '2', 2, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('3', '1', '1', 5, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('4', '1', '4', 3, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('4', '1', '3', 1, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('6', '1', '1', 1, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('6', '1', '3', 1, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('6', '1', '2', 1, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('6', '1', '4', 1, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('10', '1', '4', 4, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('11', '1', '1', 3, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('12', '1', '1', 3, 'x', NULL);
INSERT INTO public.invoice (order_id, customer_id, book_id, number, billing, shipping) VALUES ('13', '1', '2', 9, 'x', NULL);




--
-- TOC entry 3160 (class 0 OID 24762)
-- Dependencies: 239
-- Data for Name: publisher; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.publisher (name, account, email, money, percentage) VALUES ('Lion books', '345', 'lionbooks@gmail.com', 990.000, 0.6);
INSERT INTO public.publisher (name, account, email, money, percentage) VALUES ('Penguin books', '123', 'penguinbooks@gmail.com', 896.000, 0.7);





--
-- TOC entry 2953 (class 2606 OID 24791)
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);







--
-- TOC entry 2955 (class 2606 OID 24926)
-- Name: invoice invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (order_id, customer_id, book_id);




--
-- TOC entry 2991 (class 2620 OID 25090)
-- Name: book restock; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER restock AFTER UPDATE ON public.book FOR EACH ROW EXECUTE FUNCTION public.restock();


--
-- TOC entry 2992 (class 2620 OID 25067)
-- Name: invoice update_stock; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_stock AFTER INSERT ON public.invoice FOR EACH ROW EXECUTE FUNCTION public.update_stock();



ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT book_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE;


--
-- TOC entry 2987 (class 2606 OID 24954)
-- Name: collection book_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collection
    ADD CONSTRAINT book_fkey FOREIGN KEY (bookid) REFERENCES public.book(id) ON DELETE CASCADE;








--
-- TOC entry 2985 (class 2606 OID 24913)
-- Name: invoice customer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.book
    ADD CONSTRAINT publisher_fkey FOREIGN KEY (publisher) REFERENCES public.publisher(name) NOT VALID ON DELETE SET NULL;



-- Completed on 2021-12-19 00:11:36

--
-- PostgreSQL database dump complete
--

