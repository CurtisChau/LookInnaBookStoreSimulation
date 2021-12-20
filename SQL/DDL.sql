/*All schemas are taken from the testDatabasedump using pgadmin4 dump function, the constriants are sperated in the dump
I'm just adding it here to show p_keys and f_keys
*/



/*This table is intended for logging purposes only to show trigger working on the user side*/
CREATE TABLE public.adminlog (
    email character varying,
    amount numeric,
    "timestamp" timestamp with time zone,
    paid numeric
);

/*Table for book items */
/*NOTE: ISBN =id in this context*/
CREATE TABLE public.book (
    id character varying NOT NULL,
    price numeric,
    pages numeric,
    author character varying,
    name character varying,
    genre character varying,
    stock numeric NOT NULL,
    publisher character varying,
    primary key(id),
    ADD CONSTRAINT publisher_fkey FOREIGN KEY (publisher) REFERENCES public.publisher(name) NOT VALID ON DELETE SET NULL,
);

/*Table for orders from users*/
CREATE TABLE public.invoice (
    order_id character varying NOT NULL,
    customer_id character varying NOT NULL,
    book_id character varying NOT NULL,
    number numeric,
    billing character varying,
    shipping character varying
    primary key(order_id, customer_id, book_id);
    ADD CONSTRAINT customer_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE,
    ADD CONSTRAINT book_fkey FOREIGN KEY (book_id) REFERENCES public.book(id) ON DELETE CASCADE,

);

/*Table for publishers*/
CREATE TABLE public.publisher (
    name character varying NOT NULL,
    account character varying,
    email character varying,
    money numeric,
    percentage numeric,
);

/*table for collection*/
CREATE TABLE public.collection (
    id character varying NOT NULL,
    bookid character varying NOT NULL,
    collection_name character varying,
    primary key(id,bookid),
     ADD CONSTRAINT book_fkey FOREIGN KEY (bookid) REFERENCES public.book(id) ON DELETE CASCADE,
);

/*table for customer */
CREATE TABLE public.customer (
    name character varying,
    id character varying NOT NULL,
    billing character varying,
    shipping character varying,
    role "char",
    password character varying,
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);

);