--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2 (Ubuntu 13.2-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.2 (Ubuntu 13.2-1.pgdg20.04+1)

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
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: card_funding; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.card_funding AS ENUM (
    'credit',
    'debit',
    'prepaid',
    'unknown'
);


ALTER TYPE public.card_funding OWNER TO postgres;

--
-- Name: card_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.card_type AS ENUM (
    'physical',
    'virtual',
    'unknown'
);


ALTER TYPE public.card_type OWNER TO postgres;

--
-- Name: email; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.email AS character varying(255)
	CONSTRAINT email_check CHECK (((VALUE)::text ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::text));


ALTER DOMAIN public.email OWNER TO postgres;

--
-- Name: login_details_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.login_details_status AS ENUM (
    'logged_in',
    'invalid_password',
    'failed'
);


ALTER TYPE public.login_details_status OWNER TO postgres;

--
-- Name: person_honorific_title; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.person_honorific_title AS ENUM (
    'Mr',
    'Mrs',
    'Ms',
    'Miss',
    'Sr',
    'Dr',
    'Lady'
);


ALTER TYPE public.person_honorific_title OWNER TO postgres;

--
-- Name: calculate_avg_rating(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE public.beach_bar SET avg_rating = (SELECT AVG(rating_value) FROM public.beach_bar_review WHERE beach_bar_id=NEW.beach_bar_id) WHERE id = NEW.beach_bar_id;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_avg_rating() OWNER TO postgres;

--
-- Name: calculate_cart_product_total(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_product_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
 BEGIN
     PERFORM calculate_cart_total(OLD.cart_id);
     RETURN NEW;
 END;
 $$;


ALTER FUNCTION public.calculate_cart_product_total() OWNER TO postgres;

--
-- Name: calculate_cart_product_total_on_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_product_total_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
 BEGIN
     PERFORM calculate_cart_total(OLD.cart_id);
 RETURN NEW;
 END;
 $$;


ALTER FUNCTION public.calculate_cart_product_total_on_delete() OWNER TO postgres;

--
-- Name: calculate_cart_product_total_on_insert_or_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_product_total_on_insert_or_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
 DECLARE
  item RECORD;
 BEGIN
     PERFORM calculate_cart_total(NEW.cart_id);
 RETURN NEW;
 END;
 $$;


ALTER FUNCTION public.calculate_cart_product_total_on_insert_or_update() OWNER TO postgres;

--
-- Name: calculate_cart_total(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_total(me bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
 DECLARE
     hey RECORD;
 BEGIN
 UPDATE cart SET total = 0 WHERE id = me;
 FOR hey IN SELECT cart_product.cart_id, cart_product.quantity, cart_product.product_id, product.price FROM cart_product
  LEFT JOIN product ON cart_product.product_id = product.id WHERE cart_product.cart_id = me AND cart_product.deleted_at IS NULL LOOP
 UPDATE cart SET total = total + (hey.quantity * hey.price) WHERE id = hey.cart_id AND deleted_at IS NULL;
 END LOOP;
 END;
 $$;


ALTER FUNCTION public.calculate_cart_total(me bigint) OWNER TO postgres;

--
-- Name: calculate_cart_total_on_product(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_total_on_product() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
 DECLARE 
  item RECORD; 
 BEGIN 
 FOR item IN SELECT cart_product.cart_id, cart_product.product_id, cart.total, product.price, cart_product.quantity FROM 
  cart_product LEFT JOIN cart ON cart.id = cart_product.cart_id LEFT JOIN product ON product.id = cart_product.product_id  
  WHERE product_id = OLD.id AND cart_product.deleted_at IS NULL LOOP 
     PERFORM calculate_cart_total(item.cart_id); 
 END LOOP; 
 RETURN NEW; 
 END; 
 $$;


ALTER FUNCTION public.calculate_cart_total_on_product() OWNER TO postgres;

--
-- Name: calculate_cart_total_on_product_two(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_total_on_product_two() RETURNS numeric
    LANGUAGE plpgsql
    AS $$
 DECLARE
  item RECORD;
   cart_total DECIMAL DEFAULT 0;
    BEGIN
     FOR item IN SELECT cart_product.cart_id, cart_product.product_id, cart.total, product.price, cart_product.quantity FROM
       cart_product LEFT JOIN cart ON cart.id = cart_product.cart_id LEFT JOIN product ON product.id = cart_product.product_id WHERE product_id = OLD.id LOOP
             cart_total := calculate_cart_total(item.cart_id);
              END LOOP;
               RETURN TRUNC(cart_total, 2);
                END;
                 $$;


ALTER FUNCTION public.calculate_cart_total_on_product_two() OWNER TO postgres;

--
-- Name: calculate_cart_total_on_product_two(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_cart_total_on_product_two(productid integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
 DECLARE
  item RECORD;
   cart_total DECIMAL DEFAULT 0;
    BEGIN
     FOR item IN SELECT cart_product.cart_id, cart_product.product_id, cart.total, product.price, cart_product.quantity FROM
       cart_product LEFT JOIN cart ON cart.id = cart_product.cart_id LEFT JOIN product ON product.id = cart_product.product_id WHERE product_id = productid LOOP
             cart_total := calculate_cart_total(item.cart_id);
              END LOOP;
               RETURN TRUNC(cart_total, 2);
                END;
                 $$;


ALTER FUNCTION public.calculate_cart_total_on_product_two(productid integer) OWNER TO postgres;

--
-- Name: calculate_discounted_amount_or_percentage(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_discounted_amount_or_percentage() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
 DECLARE product_price decimal;
 BEGIN
 SELECT price INTO product_price FROM product WHERE id = NEW.product_id LIMIT 1;
 IF NEW.discount_amount IS NOT NULL THEN
 NEW.discount_percentage := calculate_discount_percentage(product_price, NEW.discount_amount);
 ELSIF NEW.discount_percentage IS NOT NULL THEN
 NEW.discount_amount :=calculate_discount_amount(product_price, NEW.discount_percentage);
 END IF;
 RETURN NEW;
 END;
 $$;


ALTER FUNCTION public.calculate_discounted_amount_or_percentage() OWNER TO postgres;

--
-- Name: calculate_geography_point(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_geography_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
NEW.where_is := ST_POINT(NEW.latitude, NEW.longtitude);
RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_geography_point() OWNER TO postgres;

--
-- Name: calculate_product_price_history(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_product_price_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
 DECLARE 
 product_price decimal; 
 BEGIN 
 SELECT price INTO product_price FROM product WHERE id = NEW.product_id LIMIT 1; 
 IF NEW.diff_amount IS NOT NULL THEN 
 NEW.new_price := calculate_product_price_history_new_price(product_price, NEW.diff_amount); 
 ELSIF NEW.new_price IS NOT NULL THEN 
 NEW.diff_amount := calculate_product_price_history_diff_amount(product_price, NEW.new_price); 
 END IF; 
 RETURN NEW; 
 END; 
 $$;


ALTER FUNCTION public.calculate_product_price_history() OWNER TO postgres;

--
-- Name: calculate_product_price_history_diff_amount(numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_product_price_history_diff_amount(old_price numeric, new_price numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN TRUNC(new_price - old_price, 2);
END;
$$;


ALTER FUNCTION public.calculate_product_price_history_diff_amount(old_price numeric, new_price numeric) OWNER TO postgres;

--
-- Name: calculate_product_price_history_new_price(numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_product_price_history_new_price(old_price numeric, diff_amount numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
RETURN TRUNC(old_price - diff_amount, 2);
END;
$$;


ALTER FUNCTION public.calculate_product_price_history_new_price(old_price numeric, diff_amount numeric) OWNER TO postgres;

--
-- Name: calculate_total_votes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_total_votes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.total_votes := NEW.upvotes - NEW.downvotes;
	RETURN NEW;
END; $$;


ALTER FUNCTION public.calculate_total_votes() OWNER TO postgres;

--
-- Name: calculate_where_is_geography_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_where_is_geography_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN
		NEW.where_is = ST_POINT(NEW.latitude, NEW.longitude);
	END IF;
	
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.calculate_where_is_geography_column() OWNER TO postgres;

--
-- Name: trigger_update_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
        NEW.updated_at = now();
        RETURN NEW;
    ELSE
        RETURN OLD;
    END IF;
END;
$$;


ALTER FUNCTION public.trigger_update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id integer NOT NULL,
    user_id integer NOT NULL,
    honorific_title public.person_honorific_title,
    img_url text,
    birthday date,
    age smallint,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    country_id integer,
    city_id integer,
    address character varying(100),
    zip_code character varying(12),
    track_history boolean DEFAULT true NOT NULL,
    city character varying(255),
    phone_number character varying(20),
    tel_country_id integer
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_id_seq OWNER TO postgres;

--
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- Name: account_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_user_id_seq OWNER TO postgres;

--
-- Name: account_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account.user_id;


--
-- Name: aws_s3_bucket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aws_s3_bucket (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    region character varying(25) NOT NULL,
    signature_version character varying(2) NOT NULL,
    url_expiration smallint NOT NULL,
    key_length smallint NOT NULL,
    key_and_filename_separator character varying(5) NOT NULL,
    table_name character varying(255) NOT NULL
);


ALTER TABLE public.aws_s3_bucket OWNER TO postgres;

--
-- Name: aws_s3_bucket_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aws_s3_bucket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.aws_s3_bucket_id_seq OWNER TO postgres;

--
-- Name: aws_s3_bucket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aws_s3_bucket_id_seq OWNED BY public.aws_s3_bucket.id;


--
-- Name: beach_bar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    entry_fee decimal(5,2),
    avg_rating numeric(2,1),
    is_active boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    fee_id integer NOT NULL,
    default_currency_id integer NOT NULL,
    thumbnail_url text,
    stripe_connect_id character varying(255) NOT NULL,
    zero_cart_total boolean NOT NULL,
    is_available boolean DEFAULT false NOT NULL,
    closing_time_id integer,
    opening_time_id integer,
    is_manually_controlled boolean DEFAULT false NOT NULL,
    contact_phone_number character varying(20) NOT NULL,
    hide_phone_number boolean DEFAULT false NOT NULL,
    category_id integer NOT NULL,
    slug character varying(255) NOT NULL,
    CONSTRAINT beach_bar_avg_rating_check CHECK (((avg_rating >= (0)::numeric) AND (avg_rating <= (5)::numeric))),
    CONSTRAINT check_avg_rating_value CHECK (((avg_rating >= (0)::numeric) AND (avg_rating <= (10)::numeric)))
);


ALTER TABLE public.beach_bar OWNER TO postgres;

--
-- Name: beach_bar_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_category (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.beach_bar_category OWNER TO postgres;

--
-- Name: beach_bar_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_category_id_seq OWNER TO postgres;

--
-- Name: beach_bar_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_category_id_seq OWNED BY public.beach_bar_category.id;


--
-- Name: beach_bar_entry_fee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_entry_fee (
    id bigint NOT NULL,
    fee numeric(5,2) NOT NULL,
    beach_bar_id integer NOT NULL,
    date date NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.beach_bar_entry_fee OWNER TO postgres;

--
-- Name: beach_bar_entry_fee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_entry_fee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_entry_fee_id_seq OWNER TO postgres;

--
-- Name: beach_bar_entry_fee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_entry_fee_id_seq OWNED BY public.beach_bar_entry_fee.id;


--
-- Name: beach_bar_feature; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_feature (
    beach_bar_id integer NOT NULL,
    service_id integer NOT NULL,
    quantity smallint DEFAULT 1 NOT NULL,
    description text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.beach_bar_feature OWNER TO postgres;

--
-- Name: beach_bar_service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_service (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.beach_bar_service OWNER TO postgres;

--
-- Name: beach_bar_feature_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_feature_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_feature_id_seq OWNER TO postgres;

--
-- Name: beach_bar_feature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_feature_id_seq OWNED BY public.beach_bar_service.id;


--
-- Name: beach_bar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_id_seq OWNER TO postgres;

--
-- Name: beach_bar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_id_seq OWNED BY public.beach_bar.id;


--
-- Name: beach_bar_img_url; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_img_url (
    id bigint NOT NULL,
    beach_bar_id integer NOT NULL,
    img_url text NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.beach_bar_img_url OWNER TO postgres;

--
-- Name: beach_bar_img_url_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_img_url_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_img_url_id_seq OWNER TO postgres;

--
-- Name: beach_bar_img_url_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_img_url_id_seq OWNED BY public.beach_bar_img_url.id;


--
-- Name: beach_bar_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_location (
    id integer NOT NULL,
    address character varying(100) NOT NULL,
    zip_code character varying(12),
    latitude numeric(10,6) NOT NULL,
    longitude numeric(10,6) NOT NULL,
    where_is public.geography NOT NULL,
    country_id integer NOT NULL,
    city_id integer NOT NULL,
    region_id integer,
    beach_bar_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.beach_bar_location OWNER TO postgres;

--
-- Name: beach_bar_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_location_id_seq OWNER TO postgres;

--
-- Name: beach_bar_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_location_id_seq OWNED BY public.beach_bar_location.id;


--
-- Name: beach_bar_owner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_owner (
    owner_id integer NOT NULL,
    beach_bar_id integer NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    public_info boolean DEFAULT true,
    id integer NOT NULL
);


ALTER TABLE public.beach_bar_owner OWNER TO postgres;

--
-- Name: beach_bar_owner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_owner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_owner_id_seq OWNER TO postgres;

--
-- Name: beach_bar_owner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_owner_id_seq OWNED BY public.beach_bar_owner.id;


--
-- Name: beach_bar_restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_restaurant (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    beach_bar_id integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.beach_bar_restaurant OWNER TO postgres;

--
-- Name: beach_bar_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_restaurant_id_seq OWNER TO postgres;

--
-- Name: beach_bar_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_restaurant_id_seq OWNED BY public.beach_bar_restaurant.id;


--
-- Name: beach_bar_review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_review (
    id bigint NOT NULL,
    beach_bar_id integer NOT NULL,
    customer_id bigint NOT NULL,
    payment_id bigint NOT NULL,
    rating_value smallint NOT NULL,
    visit_type_id integer,
    month_time_id integer,
    positive_comment text,
    negative_comment text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    review text,
    CONSTRAINT beach_bar_review_rating_value_check CHECK ((((rating_value)::numeric >= (0)::numeric) AND ((rating_value)::numeric <= (5)::numeric)))
);


ALTER TABLE public.beach_bar_review OWNER TO postgres;

--
-- Name: beach_bar_review_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_review_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_review_customer_id_seq OWNER TO postgres;

--
-- Name: beach_bar_review_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_review_customer_id_seq OWNED BY public.beach_bar_review.customer_id;


--
-- Name: beach_bar_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_review_id_seq OWNER TO postgres;

--
-- Name: beach_bar_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_review_id_seq OWNED BY public.beach_bar_review.id;


--
-- Name: beach_bar_review_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_review_payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_review_payment_id_seq OWNER TO postgres;

--
-- Name: beach_bar_review_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_review_payment_id_seq OWNED BY public.beach_bar_review.payment_id;


--
-- Name: beach_bar_style; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_style (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.beach_bar_style OWNER TO postgres;

--
-- Name: beach_bar_style_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beach_bar_style_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.beach_bar_style_id_seq OWNER TO postgres;

--
-- Name: beach_bar_style_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beach_bar_style_id_seq OWNED BY public.beach_bar_style.id;


--
-- Name: beach_bar_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beach_bar_type (
    beach_bar_id integer NOT NULL,
    style_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.beach_bar_type OWNER TO postgres;

--
-- Name: bundle_product_component; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bundle_product_component (
    product_id integer,
    component_id integer,
    quantity smallint DEFAULT 1 NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.bundle_product_component OWNER TO postgres;

--
-- Name: card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card (
    id bigint NOT NULL,
    type public.card_type DEFAULT 'unknown'::public.card_type NOT NULL,
    brand_id integer,
    country_id integer,
    exp_month smallint,
    exp_year smallint,
    last_4 character varying(4) NOT NULL,
    cardholder_name character varying(255) NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    saved_for_future boolean DEFAULT true,
    customer_id bigint NOT NULL,
    stripe_id character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    funding public.card_funding DEFAULT 'unknown'::public.card_funding NOT NULL,
    is_expired boolean DEFAULT false NOT NULL,
    CONSTRAINT card_exp_month_check CHECK (((exp_month >= 0) AND (exp_month <= 12))),
    CONSTRAINT card_exp_year_check CHECK ((length((exp_year)::text) = 4)),
    CONSTRAINT card_last_4_check CHECK ((length((last_4)::text) = 4))
);


ALTER TABLE public.card OWNER TO postgres;

--
-- Name: card_brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_brand (
    id integer NOT NULL,
    name character varying(35) NOT NULL
);


ALTER TABLE public.card_brand OWNER TO postgres;

--
-- Name: card_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.card_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.card_brand_id_seq OWNER TO postgres;

--
-- Name: card_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.card_brand_id_seq OWNED BY public.card_brand.id;


--
-- Name: card_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.card_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.card_id_seq OWNER TO postgres;

--
-- Name: card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.card_id_seq OWNED BY public.card.id;


--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id bigint NOT NULL,
    user_id integer,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: cart_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_product (
    id BIGSERIAL PRIMARY KEY,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity smallint DEFAULT 1 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    date date DEFAULT CURRENT_DATE NOT NULL,
    time_id integer NOT NULL,
    CONSTRAINT cart_product_quantity_check CHECK (((quantity >= 0) AND (quantity <= 20)))
);


ALTER TABLE public.cart_product OWNER TO postgres;

--
-- Name: city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.city (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country_id integer NOT NULL
);


ALTER TABLE public.city OWNER TO postgres;

--
-- Name: city_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.city_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.city_id_seq OWNER TO postgres;

--
-- Name: city_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.city_id_seq OWNED BY public.city.id;


--
-- Name: client_browser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_browser (
    id integer NOT NULL,
    name character varying(20) NOT NULL
);


ALTER TABLE public.client_browser OWNER TO postgres;

--
-- Name: client_browser_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_browser_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_browser_id_seq OWNER TO postgres;

--
-- Name: client_browser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_browser_id_seq OWNED BY public.client_browser.id;


--
-- Name: client_os; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client_os (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.client_os OWNER TO postgres;

--
-- Name: client_os_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_os_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_os_id_seq OWNER TO postgres;

--
-- Name: client_os_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_os_id_seq OWNED BY public.client_os.id;


--
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    calling_code character varying(10) NOT NULL,
    currency_id integer NOT NULL,
    is_eu boolean NOT NULL,
    alpha_3_code character varying(3) NOT NULL,
    alpha_2_code character varying(2) NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.country_id_seq OWNER TO postgres;

--
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;


--
-- Name: coupon_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_code (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    ref_code character varying(18) NOT NULL,
    discount_percentage numeric(3,0) NOT NULL,
    is_active boolean DEFAULT false,
    valid_until timestamp with time zone,
    times_limit smallint,
    times_used smallint DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    beach_bar_id integer,
    CONSTRAINT coupon_code_ref_code_check CHECK ((length((ref_code)::text) = 18)),
    CONSTRAINT coupon_code_times_limit_check CHECK (((times_limit IS NULL) OR (times_limit > 0))),
    CONSTRAINT coupon_code_times_used_times_limit_check CHECK ((times_used <= times_limit))
);


ALTER TABLE public.coupon_code OWNER TO postgres;

--
-- Name: coupon_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coupon_code_id_seq OWNER TO postgres;

--
-- Name: coupon_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupon_code_id_seq OWNED BY public.coupon_code.id;


--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    iso_code character varying(3) NOT NULL,
    symbol character varying(10) NOT NULL,
    second_symbol character varying(10)
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: currency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.currency_id_seq OWNER TO postgres;

--
-- Name: currency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.currency_id_seq OWNED BY public.currency.id;


--
-- Name: currency_product_price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency_product_price (
    id integer NOT NULL,
    currency_id integer NOT NULL,
    price numeric(5,2) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.currency_product_price OWNER TO postgres;

--
-- Name: currency_product_price_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.currency_product_price_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.currency_product_price_id_seq OWNER TO postgres;

--
-- Name: currency_product_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.currency_product_price_id_seq OWNED BY public.currency_product_price.id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id bigint NOT NULL,
    user_id integer,
    stripe_customer_id character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    phone_number character varying(20),
    country_id integer,
    email public.email
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_id_seq OWNER TO postgres;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: hour_time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hour_time (
    id integer NOT NULL,
    value time(0) without time zone NOT NULL,
    CONSTRAINT hour_time_value_check CHECK ((length((value)::text) = 8))
);


ALTER TABLE public.hour_time OWNER TO postgres;

--
-- Name: hour_time_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hour_time_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hour_time_id_seq OWNER TO postgres;

--
-- Name: hour_time_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hour_time_id_seq OWNED BY public.hour_time.id;


--
-- Name: login_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_details (
    id bigint NOT NULL,
    account_id integer NOT NULL,
    status public.login_details_status NOT NULL,
    os_id integer,
    browser_id integer,
    country_id integer,
    ip_addr cidr,
    "timestamp" timestamp with time zone DEFAULT now(),
    platform_id integer,
    city character varying(255)
);


ALTER TABLE public.login_details OWNER TO postgres;

--
-- Name: login_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.login_details_id_seq OWNER TO postgres;

--
-- Name: login_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_details_id_seq OWNED BY public.login_details.id;


--
-- Name: login_platform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_platform (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    url_hostname character varying(255) NOT NULL
);


ALTER TABLE public.login_platform OWNER TO postgres;

--
-- Name: login_platform_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_platform_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.login_platform_id_seq OWNER TO postgres;

--
-- Name: login_platform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_platform_id_seq OWNED BY public.login_platform.id;


--
-- Name: month_time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.month_time (
    id integer NOT NULL,
    value character varying(9) NOT NULL,
    days integer NOT NULL
);


ALTER TABLE public.month_time OWNER TO postgres;

--
-- Name: month_time_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.month_time_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.month_time_id_seq OWNER TO postgres;

--
-- Name: month_time_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.month_time_id_seq OWNED BY public.month_time.id;


--
-- Name: offer_campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offer_campaign (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    discount_percentage numeric(3,0) NOT NULL,
    is_active boolean DEFAULT false,
    valid_until timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.offer_campaign OWNER TO postgres;

--
-- Name: offer_campaign_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offer_campaign_code (
    id bigint NOT NULL,
    campaign_id integer NOT NULL,
    ref_code character varying(23) NOT NULL,
    times_used smallint DEFAULT 0,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT offer_campaign_code_ref_code_check CHECK ((length((ref_code)::text) = 23))
);


ALTER TABLE public.offer_campaign_code OWNER TO postgres;

--
-- Name: offer_campaign_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offer_campaign_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_campaign_code_id_seq OWNER TO postgres;

--
-- Name: offer_campaign_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offer_campaign_code_id_seq OWNED BY public.offer_campaign_code.id;


--
-- Name: offer_campaign_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offer_campaign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_campaign_id_seq OWNER TO postgres;

--
-- Name: offer_campaign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offer_campaign_id_seq OWNED BY public.offer_campaign.id;


--
-- Name: offer_campaign_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offer_campaign_product (
    campaign_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.offer_campaign_product OWNER TO postgres;

--
-- Name: owner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owner (
    id integer NOT NULL,
    user_id integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.owner OWNER TO postgres;

--
-- Name: owner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.owner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.owner_id_seq OWNER TO postgres;

--
-- Name: owner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.owner_id_seq OWNED BY public.owner.id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    card_id bigint NOT NULL,
    ref_code character varying(16) NOT NULL,
    status_id integer DEFAULT 1 NOT NULL,
    stripe_id character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    is_refunded boolean DEFAULT false NOT NULL,
    app_fee numeric(12,2) NOT NULL,
    transfer_amount numeric(12,2) NOT NULL,
    transfer_group_code character varying(19) NOT NULL,
    stripe_proccessing_fee decimal(12,2) NOT NULL,
    CONSTRAINT payment_ref_code_check CHECK ((length((ref_code)::text) = 16)),
    CONSTRAINT payment_transfer_group_code_check CHECK ((length((transfer_group_code)::text) = 19))
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_id_seq OWNER TO postgres;

--
-- Name: payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_id_seq OWNED BY public.payment.id;


--
-- Name: payment_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_status (
    id integer NOT NULL,
    name character varying(25) NOT NULL
);


ALTER TABLE public.payment_status OWNER TO postgres;

--
-- Name: payment_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_status_id_seq OWNER TO postgres;

--
-- Name: payment_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_status_id_seq OWNED BY public.payment_status.id;


--
-- Name: payment_voucher_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_voucher_code (
    id bigint NOT NULL,
    payment_id bigint NOT NULL,
    coupon_code_id bigint,
    offer_code_id bigint,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payment_voucher_code OWNER TO postgres;

--
-- Name: payment_voucher_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_voucher_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payment_voucher_code_id_seq OWNER TO postgres;

--
-- Name: payment_voucher_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_voucher_code_id_seq OWNED BY public.payment_voucher_code.id;


--
-- Name: pricing_fee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_fee (
    id integer NOT NULL,
    name character varying(75) NOT NULL,
    percentage_value numeric(4,2) NOT NULL,
    max_capacity_percentage numeric(4,2),
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    is_manually_controlled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.pricing_fee OWNER TO postgres;

--
-- Name: pricing_fee_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_fee_currency (
    currency_id integer NOT NULL,
    numeric_value numeric(4,2) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pricing_fee_currency OWNER TO postgres;

--
-- Name: pricing_fee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pricing_fee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pricing_fee_id_seq OWNER TO postgres;

--
-- Name: pricing_fee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pricing_fee_id_seq OWNED BY public.pricing_fee.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    beach_bar_id integer NOT NULL,
    price numeric(5,2) NOT NULL,
    currency_id integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    description text,
    is_individual boolean NOT NULL,
    category_id integer NOT NULL,
    max_people integer NOT NULL,
    img_url text,
    CONSTRAINT product_price_key CHECK ((price >= (0)::numeric))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    underscored_name character varying(50) NOT NULL,
    description text,
    zero_price boolean NOT NULL,
    whitelist boolean NOT NULL
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_component; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category_component (
    category_id integer NOT NULL,
    component_id integer NOT NULL
);


ALTER TABLE public.product_category_component OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_category_id_seq OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_category_id_seq OWNED BY public.product_category.id;


--
-- Name: product_component; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_component (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    quantity SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE public.product_category_component (
    category_id INTEGER PRIMARY KEY NOT NULL,
    component_id INTEGER NOT NULL,
    quantity SMALLINT NOT NULL DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES public.product_category (id),
    FOREIGN KEY (component_id) REFERENCES public.product_component (id)
);

CREATE TABLE public.icon (
    id SERIAL PRIMARY KEY NOT NULL,
    public_id VARCHAR(3) UNIQUE NOT NULL,
    name CHAR(50) UNIQUE NOT NULL
);


ALTER TABLE public.product_component OWNER TO postgres;

--
-- Name: product_component_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_component_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_component_id_seq OWNER TO postgres;

--
-- Name: product_component_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_component_id_seq OWNED BY public.product_component.id;


--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: product_price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_price_history (
    id bigint NOT NULL,
    product_id integer NOT NULL,
    owner_id integer NOT NULL,
    diff_amount numeric(5,2) NOT NULL,
    new_price numeric(5,2) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_price_history OWNER TO postgres;

--
-- Name: product_price_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_price_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_price_history_id_seq OWNER TO postgres;

--
-- Name: product_price_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_price_history_id_seq OWNED BY public.product_price_history.id;


--
-- Name: product_reservation_limit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_reservation_limit (
    id bigint NOT NULL,
    limit_number integer NOT NULL,
    product_id integer NOT NULL,
    date date NOT NULL,
    start_time_id integer NOT NULL,
    end_time_id integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT product_reservation_limit_check CHECK ((end_time_id >= start_time_id)),
    CONSTRAINT product_reservation_limit_limit_number_check CHECK ((limit_number > 0))
);


ALTER TABLE public.product_reservation_limit OWNER TO postgres;

--
-- Name: product_reservation_limit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_reservation_limit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_reservation_limit_id_seq OWNER TO postgres;

--
-- Name: product_reservation_limit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_reservation_limit_id_seq OWNED BY public.product_reservation_limit.id;


--
-- Name: quarter_time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quarter_time (
    id integer NOT NULL,
    value time(0) without time zone NOT NULL,
    CONSTRAINT quarter_time_value_check CHECK ((length((value)::text) = 8))
);


ALTER TABLE public.quarter_time OWNER TO postgres;

--
-- Name: quarter_time_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quarter_time_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quarter_time_id_seq OWNER TO postgres;

--
-- Name: quarter_time_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quarter_time_id_seq OWNED BY public.quarter_time.id;


--
-- Name: refund_percentage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_percentage (
    id integer NOT NULL,
    percentage_value integer NOT NULL,
    days_limit integer NOT NULL,
    days_milliseconds bigint NOT NULL,
    CONSTRAINT refund_percentage_days_milliseconds_check CHECK ((days_milliseconds >= 86400000))
);


ALTER TABLE public.refund_percentage OWNER TO postgres;

--
-- Name: refund_percentage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refund_percentage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refund_percentage_id_seq OWNER TO postgres;

--
-- Name: refund_percentage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refund_percentage_id_seq OWNED BY public.refund_percentage.id;


--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country_id integer NOT NULL,
    city_id integer NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.region_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.region_id_seq OWNER TO postgres;

--
-- Name: region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.region_id_seq OWNED BY public.region.id;


--
-- Name: reserved_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reserved_product (
    id bigint NOT NULL,
    product_id integer NOT NULL,
    payment_id bigint NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    date date NOT NULL,
    time_id integer NOT NULL,
    is_refunded boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reserved_product OWNER TO postgres;

--
-- Name: reserved_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reserved_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reserved_products_id_seq OWNER TO postgres;

--
-- Name: reserved_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reserved_products_id_seq OWNED BY public.reserved_product.id;


--
-- Name: restaurant_food_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_food_item (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(7,2) NOT NULL,
    img_url text,
    menu_category_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.restaurant_food_item OWNER TO postgres;

--
-- Name: restaurant_food_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_food_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_food_item_id_seq OWNER TO postgres;

--
-- Name: restaurant_food_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_food_item_id_seq OWNED BY public.restaurant_food_item.id;


--
-- Name: restaurant_menu_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_menu_category (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.restaurant_menu_category OWNER TO postgres;

--
-- Name: restaurant_menu_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_menu_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_menu_category_id_seq OWNER TO postgres;

--
-- Name: restaurant_menu_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_menu_category_id_seq OWNED BY public.restaurant_menu_category.id;


--
-- Name: review_answer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_answer (
    id bigint NOT NULL,
    review_id bigint NOT NULL,
    body text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.review_answer OWNER TO postgres;

--
-- Name: review_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_answer_id_seq OWNER TO postgres;

--
-- Name: review_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_answer_id_seq OWNED BY public.review_answer.id;


--
-- Name: review_visit_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_visit_type (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.review_visit_type OWNER TO postgres;

--
-- Name: review_visit_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_visit_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_visit_type_id_seq OWNER TO postgres;

--
-- Name: review_visit_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_visit_type_id_seq OWNED BY public.review_visit_type.id;


--
-- Name: review_vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_vote (
    id bigint NOT NULL,
    review_id integer NOT NULL,
    user_id bigint NOT NULL,
    type_id bigint NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.review_vote OWNER TO postgres;

--
-- Name: review_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_vote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_vote_id_seq OWNER TO postgres;

--
-- Name: review_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_vote_id_seq OWNED BY public.review_vote.id;


--
-- Name: review_vote_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_vote_type (
    id integer NOT NULL,
    value character varying(255) NOT NULL
);


ALTER TABLE public.review_vote_type OWNER TO postgres;

--
-- Name: review_vote_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_vote_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_vote_type_id_seq OWNER TO postgres;

--
-- Name: review_vote_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_vote_type_id_seq OWNED BY public.review_vote_type.id;


--
-- Name: search_filter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_filter (
    id integer NOT NULL,
    public_id character varying(3) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    CONSTRAINT search_filter_public_id_check CHECK ((length((public_id)::text) = 3))
);


ALTER TABLE public.search_filter OWNER TO postgres;

--
-- Name: search_filter_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_filter_category (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.search_filter_category OWNER TO postgres;

--
-- Name: search_filter_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_filter_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_filter_category_id_seq OWNER TO postgres;

--
-- Name: search_filter_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_filter_category_id_seq OWNED BY public.search_filter_category.id;


--
-- Name: search_filter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_filter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_filter_id_seq OWNER TO postgres;

--
-- Name: search_filter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_filter_id_seq OWNED BY public.search_filter.id;


--
-- Name: search_filter_section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_filter_section (
    filter_id integer NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.search_filter_section OWNER TO postgres;

--
-- Name: search_input_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_input_value (
    id bigint NOT NULL,
    public_id character varying(5) NOT NULL,
    country_id integer,
    city_id integer,
    region_id integer,
    beach_bar_id integer,
    updated_at timestamp with time zone DEFAULT now(),
    "timestamp" timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT search_input_value_public_id_check CHECK ((length((public_id)::text) = 5))
);


ALTER TABLE public.search_input_value OWNER TO postgres;

--
-- Name: search_input_value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_input_value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_input_value_id_seq OWNER TO postgres;

--
-- Name: search_input_value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_input_value_id_seq OWNED BY public.search_input_value.id;


--
-- Name: search_sort; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_sort (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.search_sort OWNER TO postgres;

--
-- Name: search_sort_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_sort_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_sort_type_id_seq OWNER TO postgres;

--
-- Name: search_sort_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_sort_type_id_seq OWNED BY public.search_sort.id;


--
-- Name: stripe_fee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stripe_fee (
    id integer NOT NULL,
    percentage_value numeric(4,2) NOT NULL,
    pricing_fee numeric(4,2) NOT NULL,
    is_eu boolean NOT NULL,
    currency_id integer NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.stripe_fee OWNER TO postgres;

--
-- Name: stripe_fee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stripe_fee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stripe_fee_id_seq OWNER TO postgres;

--
-- Name: stripe_fee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stripe_fee_id_seq OWNED BY public.stripe_fee.id;


--
-- Name: stripe_minimum_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stripe_minimum_currency (
    id integer NOT NULL,
    charge_amount numeric(4,2) NOT NULL,
    currency_id integer NOT NULL
);


ALTER TABLE public.stripe_minimum_currency OWNER TO postgres;

--
-- Name: stripe_minimum_currency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stripe_minimum_currency_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stripe_minimum_currency_id_seq OWNER TO postgres;

--
-- Name: stripe_minimum_currency_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stripe_minimum_currency_id_seq OWNED BY public.stripe_minimum_currency.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    hashtag_id bigint,
    google_id character varying(255),
    facebook_id character varying(255),
    instagram_id character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    token_version integer DEFAULT 0 NOT NULL,
    instagram_username character varying(35),
    email public.email NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_contact_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_contact_details (
    id integer NOT NULL,
    account_id integer NOT NULL,
    country_id integer,
    phone_number character varying(20),
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now(),
    "timestamp" timestamp with time zone DEFAULT now(),
    secondary_email public.email
);


ALTER TABLE public.user_contact_details OWNER TO postgres;

--
-- Name: user_contact_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_contact_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_contact_details_id_seq OWNER TO postgres;

--
-- Name: user_contact_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_contact_details_id_seq OWNED BY public.user_contact_details.id;


--
-- Name: user_favorite_bar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_favorite_bar (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    beach_bar_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_favorite_bar OWNER TO postgres;

--
-- Name: user_favorite_bar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_favorite_bar_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_favorite_bar_id_seq OWNER TO postgres;

--
-- Name: user_favorite_bar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_favorite_bar_id_seq OWNED BY public.user_favorite_bar.id;


--
-- Name: user_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_history (
    id bigint NOT NULL,
    activity_id integer NOT NULL,
    object_id bigint,
    user_id integer,
    ip_addr cidr,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_history OWNER TO postgres;

--
-- Name: user_history_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_history_activity (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_history_activity OWNER TO postgres;

--
-- Name: user_history_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_history_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_history_activity_id_seq OWNER TO postgres;

--
-- Name: user_history_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_history_activity_id_seq OWNED BY public.user_history_activity.id;


--
-- Name: user_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_history_id_seq OWNER TO postgres;

--
-- Name: user_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_history_id_seq OWNED BY public.user_history.id;


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_search; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_search (
    id bigint NOT NULL,
    search_date date,
    search_adults smallint,
    search_children smallint,
    user_id integer,
    input_value_id bigint NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sort_id smallint,
    CONSTRAINT user_search_search_adults_check CHECK ((search_adults <= 12)),
    CONSTRAINT user_search_search_children_check CHECK ((search_children <= 8))
);


ALTER TABLE public.user_search OWNER TO postgres;

--
-- Name: user_search_filter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_search_filter (
    search_id bigint NOT NULL,
    filter_id integer NOT NULL
);


ALTER TABLE public.user_search_filter OWNER TO postgres;

--
-- Name: user_search_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_search_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_search_id_seq OWNER TO postgres;

--
-- Name: user_search_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_search_id_seq OWNED BY public.user_search.id;


--
-- Name: vote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vote (
    id bigint NOT NULL,
    feedback_id integer NOT NULL,
    user_id integer,
    rating character(1) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT vote_rating_check CHECK ((rating = ANY (ARRAY['y'::bpchar, 'n'::bpchar])))
);


ALTER TABLE public.vote OWNER TO postgres;

--
-- Name: voting_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voting_feedback (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    ref_code character varying(4) NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.voting_feedback OWNER TO postgres;

--
-- Name: vote_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vote_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vote_category_id_seq OWNER TO postgres;

--
-- Name: vote_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vote_category_id_seq OWNED BY public.voting_feedback.id;


--
-- Name: vote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vote_id_seq OWNER TO postgres;

--
-- Name: vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vote_id_seq OWNED BY public.vote.id;


--
-- Name: voting_result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voting_result (
    id integer NOT NULL,
    feedback_id integer NOT NULL,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    total_votes integer
);


ALTER TABLE public.voting_result OWNER TO postgres;

--
-- Name: vote_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vote_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vote_tag_id_seq OWNER TO postgres;

--
-- Name: vote_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vote_tag_id_seq OWNED BY public.voting_result.id;


--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Name: account user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN user_id SET DEFAULT nextval('public.account_user_id_seq'::regclass);


--
-- Name: aws_s3_bucket id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aws_s3_bucket ALTER COLUMN id SET DEFAULT nextval('public.aws_s3_bucket_id_seq'::regclass);


--
-- Name: beach_bar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_id_seq'::regclass);


--
-- Name: beach_bar_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_category ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_category_id_seq'::regclass);


--
-- Name: beach_bar_entry_fee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_entry_fee ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_entry_fee_id_seq'::regclass);


--
-- Name: beach_bar_img_url id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_img_url ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_img_url_id_seq'::regclass);


--
-- Name: beach_bar_location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_location_id_seq'::regclass);


--
-- Name: beach_bar_owner id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_owner ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_owner_id_seq'::regclass);


--
-- Name: beach_bar_restaurant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_restaurant ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_restaurant_id_seq'::regclass);


--
-- Name: beach_bar_review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_review_id_seq'::regclass);


--
-- Name: beach_bar_review customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review ALTER COLUMN customer_id SET DEFAULT nextval('public.beach_bar_review_customer_id_seq'::regclass);


--
-- Name: beach_bar_review payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review ALTER COLUMN payment_id SET DEFAULT nextval('public.beach_bar_review_payment_id_seq'::regclass);


--
-- Name: beach_bar_service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_service ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_feature_id_seq'::regclass);


--
-- Name: beach_bar_style id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_style ALTER COLUMN id SET DEFAULT nextval('public.beach_bar_style_id_seq'::regclass);


--
-- Name: card id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card ALTER COLUMN id SET DEFAULT nextval('public.card_id_seq'::regclass);


--
-- Name: card_brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_brand ALTER COLUMN id SET DEFAULT nextval('public.card_brand_id_seq'::regclass);


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: city id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city ALTER COLUMN id SET DEFAULT nextval('public.city_id_seq'::regclass);


--
-- Name: client_browser id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_browser ALTER COLUMN id SET DEFAULT nextval('public.client_browser_id_seq'::regclass);


--
-- Name: client_os id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_os ALTER COLUMN id SET DEFAULT nextval('public.client_os_id_seq'::regclass);


--
-- Name: country id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);


--
-- Name: coupon_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_code ALTER COLUMN id SET DEFAULT nextval('public.coupon_code_id_seq'::regclass);


--
-- Name: currency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency ALTER COLUMN id SET DEFAULT nextval('public.currency_id_seq'::regclass);


--
-- Name: currency_product_price id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_product_price ALTER COLUMN id SET DEFAULT nextval('public.currency_product_price_id_seq'::regclass);


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: hour_time id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hour_time ALTER COLUMN id SET DEFAULT nextval('public.hour_time_id_seq'::regclass);


--
-- Name: login_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details ALTER COLUMN id SET DEFAULT nextval('public.login_details_id_seq'::regclass);


--
-- Name: login_platform id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_platform ALTER COLUMN id SET DEFAULT nextval('public.login_platform_id_seq'::regclass);


--
-- Name: month_time id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.month_time ALTER COLUMN id SET DEFAULT nextval('public.month_time_id_seq'::regclass);


--
-- Name: offer_campaign id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign ALTER COLUMN id SET DEFAULT nextval('public.offer_campaign_id_seq'::regclass);


--
-- Name: offer_campaign_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign_code ALTER COLUMN id SET DEFAULT nextval('public.offer_campaign_code_id_seq'::regclass);


--
-- Name: owner id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner ALTER COLUMN id SET DEFAULT nextval('public.owner_id_seq'::regclass);


--
-- Name: payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN id SET DEFAULT nextval('public.payment_id_seq'::regclass);


--
-- Name: payment_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_status ALTER COLUMN id SET DEFAULT nextval('public.payment_status_id_seq'::regclass);


--
-- Name: payment_voucher_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code ALTER COLUMN id SET DEFAULT nextval('public.payment_voucher_code_id_seq'::regclass);


--
-- Name: pricing_fee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee ALTER COLUMN id SET DEFAULT nextval('public.pricing_fee_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: product_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category ALTER COLUMN id SET DEFAULT nextval('public.product_category_id_seq'::regclass);


--
-- Name: product_component id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_component ALTER COLUMN id SET DEFAULT nextval('public.product_component_id_seq'::regclass);


--
-- Name: product_price_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history ALTER COLUMN id SET DEFAULT nextval('public.product_price_history_id_seq'::regclass);


--
-- Name: product_reservation_limit id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reservation_limit ALTER COLUMN id SET DEFAULT nextval('public.product_reservation_limit_id_seq'::regclass);


--
-- Name: quarter_time id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarter_time ALTER COLUMN id SET DEFAULT nextval('public.quarter_time_id_seq'::regclass);


--
-- Name: refund_percentage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_percentage ALTER COLUMN id SET DEFAULT nextval('public.refund_percentage_id_seq'::regclass);


--
-- Name: region id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region ALTER COLUMN id SET DEFAULT nextval('public.region_id_seq'::regclass);


--
-- Name: reserved_product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserved_product ALTER COLUMN id SET DEFAULT nextval('public.reserved_products_id_seq'::regclass);


--
-- Name: restaurant_food_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_food_item ALTER COLUMN id SET DEFAULT nextval('public.restaurant_food_item_id_seq'::regclass);


--
-- Name: restaurant_menu_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_menu_category ALTER COLUMN id SET DEFAULT nextval('public.restaurant_menu_category_id_seq'::regclass);


--
-- Name: review_answer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_answer ALTER COLUMN id SET DEFAULT nextval('public.review_answer_id_seq'::regclass);


--
-- Name: review_visit_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_visit_type ALTER COLUMN id SET DEFAULT nextval('public.review_visit_type_id_seq'::regclass);


--
-- Name: review_vote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote ALTER COLUMN id SET DEFAULT nextval('public.review_vote_id_seq'::regclass);


--
-- Name: review_vote_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote_type ALTER COLUMN id SET DEFAULT nextval('public.review_vote_type_id_seq'::regclass);


--
-- Name: search_filter id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter ALTER COLUMN id SET DEFAULT nextval('public.search_filter_id_seq'::regclass);


--
-- Name: search_filter_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter_category ALTER COLUMN id SET DEFAULT nextval('public.search_filter_category_id_seq'::regclass);


--
-- Name: search_input_value id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value ALTER COLUMN id SET DEFAULT nextval('public.search_input_value_id_seq'::regclass);


--
-- Name: search_sort id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_sort ALTER COLUMN id SET DEFAULT nextval('public.search_sort_type_id_seq'::regclass);


--
-- Name: stripe_fee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_fee ALTER COLUMN id SET DEFAULT nextval('public.stripe_fee_id_seq'::regclass);


--
-- Name: stripe_minimum_currency id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_minimum_currency ALTER COLUMN id SET DEFAULT nextval('public.stripe_minimum_currency_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: user_contact_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contact_details ALTER COLUMN id SET DEFAULT nextval('public.user_contact_details_id_seq'::regclass);


--
-- Name: user_favorite_bar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorite_bar ALTER COLUMN id SET DEFAULT nextval('public.user_favorite_bar_id_seq'::regclass);


--
-- Name: user_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history ALTER COLUMN id SET DEFAULT nextval('public.user_history_id_seq'::regclass);


--
-- Name: user_history_activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history_activity ALTER COLUMN id SET DEFAULT nextval('public.user_history_activity_id_seq'::regclass);


--
-- Name: user_search id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search ALTER COLUMN id SET DEFAULT nextval('public.user_search_id_seq'::regclass);


--
-- Name: vote id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote ALTER COLUMN id SET DEFAULT nextval('public.vote_id_seq'::regclass);


--
-- Name: voting_feedback id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_feedback ALTER COLUMN id SET DEFAULT nextval('public.vote_category_id_seq'::regclass);


--
-- Name: voting_result id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_result ALTER COLUMN id SET DEFAULT nextval('public.vote_tag_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, user_id, honorific_title, img_url, birthday, age, is_active, updated_at, "timestamp", deleted_at, country_id, city_id, address, zip_code, track_history, city, phone_number, tel_country_id) FROM stdin;
102	108	\N	\N	\N	\N	t	2021-03-07 00:45:52.172593+02	2021-03-07 00:45:52.172593+02	\N	\N	\N	\N	\N	t	\N	\N	\N
103	109	\N	\N	\N	\N	t	2021-03-07 00:52:01.685154+02	2021-03-07 00:52:01.685154+02	\N	\N	\N	\N	\N	t	\N	\N	\N
104	110	\N	\N	\N	\N	t	2021-03-07 00:53:41.003425+02	2021-03-07 00:53:41.003425+02	\N	\N	\N	\N	\N	t	\N	\N	\N
105	111	\N	\N	\N	\N	t	2021-03-07 01:02:40.476042+02	2021-03-07 01:02:40.476042+02	\N	\N	\N	\N	\N	t	\N	\N	\N
106	112	\N	\N	\N	\N	t	2021-03-07 01:03:15.282377+02	2021-03-07 01:03:15.282377+02	\N	\N	\N	\N	\N	t	\N	\N	\N
101	107	Ms	\N	\N	17	t	2021-03-18 10:11:02.690003+02	2020-06-26 00:02:38.256581+03	\N	66	1	54646	54646	f	Laskaratou 17	697 495 4916	66
\.


--
-- Data for Name: aws_s3_bucket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.aws_s3_bucket (id, name, region, signature_version, url_expiration, key_length, key_and_filename_separator, table_name) FROM stdin;
1	beach-bar.user-profile-image	eu-west-1	v4	60	16	-	user
\.


--
-- Data for Name: beach_bar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar (id, name, description, avg_rating, is_active, updated_at, "timestamp", deleted_at, fee_id, default_currency_id, thumbnail_url, stripe_connect_id, zero_cart_total, is_available, closing_time_id, opening_time_id, is_manually_controlled, contact_phone_number, hide_phone_number, category_id, slug) FROM stdin;
3	Kikabu	The ultimate beach escape.	4.5	t	2021-03-19 18:35:38.393743+02	2020-07-10 19:35:26.909032+03	\N	1	1	https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60	acct_1H3rEkFY9tq8pABG	t	f	90	29	f	2310 428 734	f	1	kikabu
1	#beach_bar	Built with ❤️ by us.	3.4	t	2021-03-19 18:48:15.405778+02	2020-06-05 22:28:01.973076+03	\N	1	1	https://r-cf.bstatic.com/images/hotel/max1024x768/208/208351646.jpg	acct_1H3r4iAHamAdpCwd	f	t	90	29	f	2310 428 734	f	1	beach_bar
2	Khoa	The absolute paradise in Greece.	4.5	t	2021-03-19 17:33:47.916764+02	2020-07-05 13:49:16.678776+03	\N	1	1	https://images.unsplash.com/photo-1533105079780-92b9be482077?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Nnx8Z3JlZWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60	acct_1H3rA4Fe0gE1WnZg	t	t	90	29	f	2310 428 734	f	1	khoa
\.


--
-- Data for Name: beach_bar_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_category (id, name, description) FROM stdin;
1	Beach bar	\N
2	Hotel	\N
\.


--
-- Data for Name: beach_bar_entry_fee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_entry_fee (id, fee, beach_bar_id, date, updated_at, "timestamp", deleted_at) FROM stdin;
35	0.50	2	2020-07-10	2020-07-12 00:31:22.91737+03	2020-07-12 00:31:22.91737+03	\N
29	0.50	1	2020-07-01	2020-07-01 20:13:33.145976+03	2020-07-01 19:46:42.996164+03	2020-07-01 20:13:33.145976+03
30	0.50	1	2020-07-02	2020-07-01 20:13:33.168847+03	2020-07-01 19:46:43.258892+03	2020-07-01 20:13:33.168847+03
34	0.50	1	2020-07-11	2020-07-12 00:31:13.525995+03	2020-07-12 00:31:13.525995+03	\N
33	0.50	1	2020-07-13	2020-07-12 00:30:59.098463+03	2020-07-12 00:30:59.098463+03	\N
36	0.00	1	2020-07-20	2020-07-20 17:53:14.561541+03	2020-07-20 17:53:14.561541+03	\N
37	0.00	1	2020-07-21	2020-07-20 17:55:25.059732+03	2020-07-20 17:55:25.059732+03	\N
38	0.00	1	2020-07-22	2020-07-20 17:56:49.445867+03	2020-07-20 17:56:49.445867+03	\N
39	0.00	1	2020-07-23	2020-07-20 17:58:26.374804+03	2020-07-20 17:58:26.374804+03	\N
\.


--
-- Data for Name: beach_bar_feature; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_feature (beach_bar_id, service_id, quantity, description, "timestamp", updated_at, deleted_at) FROM stdin;
1	1	2	Hey wow	2020-06-20 23:25:11.386791+03	2020-06-24 22:46:27.409432+03	\N
\.


--
-- Data for Name: beach_bar_img_url; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_img_url (id, beach_bar_id, img_url, description, updated_at, "timestamp", deleted_at) FROM stdin;
1	1	"http://127.0.0.1:4000/graphql"	Prenium Suite	2020-07-30 16:20:05.211901+03	2020-07-30 16:04:18.33127+03	2020-07-30 16:20:05.211901+03
5	1	http://127.0.0.1:4000/graphql	Prenium Suite 3	2020-07-30 16:32:09.93131+03	2020-07-30 16:30:57.848382+03	2020-07-30 16:32:09.93131+03
2	1	"https://s3-eu-west-1.amazonaws.com/beach-bar.user-profile-image/B7wVXAHeeBdrBS43-IMG-20190728-160545-HDR.jpg"	Prenium Suite	2020-07-30 16:32:21.646102+03	2020-07-30 16:20:12.203166+03	2020-07-30 16:32:21.646102+03
3	1	"https://s3-eu-west-1.amazonaws.com/beach-bar.user-profile-image/B7wVXAHeeBdrBS43-IMG-20190728-160545-HDR.jpg"	Prenium Suite	2020-07-30 16:32:25.374172+03	2020-07-30 16:24:26.393244+03	2020-07-30 16:32:25.374172+03
4	1	https://s3-eu-west-1.amazonaws.com/beach-bar.user-profile-image/B7wVXAHeeBdrBS43-IMG-20190728-160545-HDR.jpg	Prenium Suite 2	2020-07-30 16:32:29.756905+03	2020-07-30 16:29:38.075929+03	2020-07-30 16:32:29.756905+03
\.


--
-- Data for Name: beach_bar_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_location (id, address, zip_code, latitude, longitude, where_is, country_id, city_id, region_id, beach_bar_id, "timestamp", updated_at, deleted_at) FROM stdin;
11	Martiou 25	\N	39.909736	23.083828	0101000020E610000037FFAF3A72F44340357D76C075153740	66	3	\N	3	2020-07-14 01:30:34.687764+03	2020-07-14 01:30:34.687764+03	\N
10	Καβάφη 1	54646	37.520665	23.562055	0101000020E6100000FF959526A5C24240A48D23D6E28F3740	66	2	\N	1	2020-07-12 00:01:55.02054+03	2020-07-20 17:55:39.659125+03	\N
13	Laskaratou 17	\N	40.598039	22.954036	0101000020E6100000C45DBD8A8C4C4440E7340BB43BF43640	66	2	1	2	2020-07-14 15:55:56.026384+03	2020-07-14 15:55:56.026384+03	\N
\.


--
-- Data for Name: beach_bar_owner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_owner (owner_id, beach_bar_id, deleted_at, updated_at, "timestamp", is_primary, public_info, id) FROM stdin;
41	1	\N	2020-06-26 00:03:38.415381+03	2020-06-26 00:03:38.415381+03	t	t	9
\.


--
-- Data for Name: beach_bar_restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_restaurant (id, name, description, beach_bar_id, is_active, updated_at, "timestamp", deleted_at) FROM stdin;
1	Thalassa	\N	1	t	2020-06-07 18:04:19.040416+03	2020-06-07 18:04:19.040416+03	\N
2	Khoa	Hey	1	t	2020-06-30 18:09:07.890769+03	2020-06-30 17:21:28.753708+03	\N
\.


--
-- Data for Name: beach_bar_review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_review (id, beach_bar_id, customer_id, payment_id, rating_value, visit_type_id, month_time_id, positive_comment, negative_comment, updated_at, "timestamp", deleted_at, review) FROM stdin;
19	1	17	117	5	\N	2	\N	\N	2021-03-15 19:59:38.316967+02	2021-03-15 18:23:53.819935+02	\N	heue fejf fiej diofio e
12	1	17	117	4	2	8	It was nice decorated with modern facilities	It was not nice at all	2021-03-14 21:57:52.061454+02	2021-03-14 21:18:29.755659+02	\N	heue fejf fiej diofio e
13	1	17	117	3	2	8	heyr kfk e	\N	2021-03-15 18:19:29.163985+02	2021-03-14 21:19:17.37422+02	2021-03-15 18:19:29.163985+02	heue fejf fiej diofio e
14	1	17	117	3	2	8	\N	\N	2021-03-15 18:21:33.280972+02	2021-03-15 18:20:23.37063+02	2021-03-15 18:21:33.280972+02	heue fejf fiej diofio e
15	1	17	117	3	2	8	\N	\N	2021-03-15 18:22:02.493772+02	2021-03-15 18:21:47.132572+02	2021-03-15 18:22:02.493772+02	heue fejf fiej diofio e
16	1	17	117	3	2	8	\N	\N	2021-03-15 18:22:26.006695+02	2021-03-15 18:22:11.352846+02	2021-03-15 18:22:26.006695+02	heue fejf fiej diofio e
17	1	17	117	3	2	8	\N	\N	2021-03-15 18:22:50.409673+02	2021-03-15 18:22:33.970357+02	2021-03-15 18:22:50.409673+02	heue fejf fiej diofio e
18	1	17	117	3	2	8	\N	\N	2021-03-15 18:23:45.692033+02	2021-03-15 18:22:59.155621+02	2021-03-15 18:23:45.692033+02	heue fejf fiej diofio e
\.


--
-- Data for Name: beach_bar_service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_service (id, name) FROM stdin;
1	Pool
4	Private bay
5	Snacks
3	Free parking
\.


--
-- Data for Name: beach_bar_style; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_style (id, name) FROM stdin;
1	Family-friendly
2	Loud music
3	Parties & concerts
4	Romantic
5	Modern
6	Tropical
7	Self-service
\.


--
-- Data for Name: beach_bar_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beach_bar_type (beach_bar_id, style_id, "timestamp", deleted_at) FROM stdin;
\.


--
-- Data for Name: bundle_product_component; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bundle_product_component (product_id, component_id, quantity, "timestamp", deleted_at) FROM stdin;
64	2	1	2020-06-25 01:17:16.595389+03	\N
64	4	1	2020-06-25 01:17:16.661765+03	\N
98	2	1	2020-06-25 13:17:33.545394+03	2020-06-25 17:03:26.727738+03
98	4	1	2020-06-25 13:17:33.563854+03	2020-06-25 17:03:26.727738+03
99	2	1	2020-06-25 13:23:32.649856+03	2020-07-01 23:50:50.128632+03
99	4	1	2020-06-25 13:23:32.668906+03	2020-07-01 23:50:50.128632+03
\.


--
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card (id, type, brand_id, country_id, exp_month, exp_year, last_4, cardholder_name, is_default, customer_id, stripe_id, updated_at, "timestamp", deleted_at, funding, is_expired) FROM stdin;
76	unknown	2	187	12	2021	4242	George Krachtopoulos	f	17	card_1ITvOoFMzPANwdsqLy2NitSo	2021-03-11 18:21:44.355636+02	2021-03-11 18:21:25.01573+02	2021-03-11 18:21:44.355636+02	unknown	f
78	unknown	2	187	12	2021	4242	George Krachtopoulos	f	17	card_1ITvRDFMzPANwdsq05xsfQpt	2021-03-11 18:24:11.447064+02	2021-03-11 18:23:54.556881+02	2021-03-11 18:24:11.447064+02	unknown	f
80	unknown	2	187	12	2021	4242	George Krachtopoulos	f	17	card_1ITvYWFMzPANwdsqexTUNQ7U	2021-03-11 18:31:56.899943+02	2021-03-11 18:31:28.176608+02	2021-03-11 18:31:56.899943+02	unknown	f
82	unknown	2	187	12	2022	4242	George Krachtopoul	f	17	card_1ITvmcFMzPANwdsqpniwXegX	2021-03-11 18:47:28.749159+02	2021-03-11 18:46:01.765791+02	2021-03-11 18:47:28.749159+02	unknown	f
13	unknown	1	3	6	2021	4444	George	f	17	card_1GykyxFMzPANwdsqOJj9Dl13	2021-03-11 14:58:12.052+02	2020-06-27 23:50:37.49515+03	2021-03-11 14:58:12.052+02	unknown	f
22	unknown	2	187	11	2021	4242	George	f	17	card_1ITjLuFMzPANwdsq4LdOwa4G	2021-03-11 15:00:50.779567+02	2021-03-11 09:54:39.974988+02	2021-03-11 15:00:50.779567+02	unknown	f
23	unknown	2	187	11	2021	4242	George	f	17	card_1ITjMjFMzPANwdsqYQMh55G0	2021-03-11 15:00:56.71478+02	2021-03-11 09:55:30.36005+02	2021-03-11 15:00:56.71478+02	unknown	f
24	unknown	2	187	11	2021	4242	George	f	17	card_1ITjPbFMzPANwdsqlfYs9W6V	2021-03-11 15:00:59.864573+02	2021-03-11 09:58:28.954588+02	2021-03-11 15:00:59.864573+02	unknown	f
84	unknown	2	187	12	2022	4242	George Krachtopoul	f	17	card_1ITvqAFMzPANwdsq9khudUjh	2021-03-11 18:54:29.562203+02	2021-03-11 18:49:41.039847+02	2021-03-11 18:54:29.562203+02	unknown	f
36	unknown	2	187	11	2021	4242	George	f	17	card_1ITkX0FMzPANwdsqtobJVhbn	2021-03-11 15:02:24.817662+02	2021-03-11 11:10:11.719708+02	2021-03-11 15:02:24.817662+02	unknown	f
75	unknown	1	187	11	2022	4444	George Krachtopoulos	f	17	card_1ITpyyFMzPANwdsq5XPkbeOR	2021-03-11 18:55:14.757+02	2021-03-11 16:46:43.919878+02	\N	unknown	f
37	unknown	2	187	11	2021	4242	George	f	17	card_1ITkXLFMzPANwdsqBLqTn31L	2021-03-11 15:02:53.481898+02	2021-03-11 11:10:32.474694+02	2021-03-11 15:02:53.481898+02	unknown	f
38	unknown	\N	187	11	2021	0005	George krac	f	17	card_1ITkZ8FMzPANwdsqXT7eaTAx	2021-03-11 15:02:56.400422+02	2021-03-11 11:12:24.256349+02	2021-03-11 15:02:56.400422+02	unknown	f
69	unknown	\N	187	11	2021	0005	George	t	17	card_1ITkelFMzPANwdsqLLRBjmSW	2021-03-11 15:03:06.663589+02	2021-03-11 11:18:12.756989+02	2021-03-11 15:03:06.663589+02	unknown	f
71	unknown	2	187	11	2021	4242	George	f	17	card_1ITkguFMzPANwdsq2Wv25V7L	2021-03-11 15:03:23.988044+02	2021-03-11 11:20:25.545629+02	2021-03-11 15:03:23.988044+02	unknown	f
86	unknown	2	187	12	2022	4242	George Krachtopoul	f	17	card_1ITvvMFMzPANwdsqLTCOns3B	2021-03-11 18:55:45.946006+02	2021-03-11 18:55:03.579529+02	\N	unknown	f
21	unknown	2	3	12	2021	0077	George	f	17	card_1H1vxhFMzPANwdsqgTAiegRS	2021-03-11 15:00:46.894656+02	2020-07-06 18:10:32.403633+03	\N	unknown	f
14	unknown	1	3	12	2023	4444	George	f	17	card_1GykzMFMzPANwdsq8TZE9gDc	2020-06-28 23:18:14.448674+03	2020-06-27 23:51:01.589858+03	2020-06-28 00:48:12.978721+03	unknown	f
18	unknown	2	3	8	2021	4242	George	f	17	card_1Gz5x8FMzPANwdsqg3Zscmo5	2020-06-28 23:18:14.448674+03	2020-06-28 22:14:11.580585+03	2020-06-28 23:01:10.282969+03	unknown	f
77	unknown	2	187	12	2021	4242	George Krachtopoulos	t	17	card_1ITvPbFMzPANwdsqXhQDeljL	2021-03-11 18:23:01.70418+02	2021-03-11 18:22:14.60611+02	2021-03-11 18:23:01.70418+02	unknown	f
73	unknown	2	187	11	2021	4242	George	f	17	card_1ITl3MFMzPANwdsqvwQPtBGB	2021-03-11 16:46:07.432545+02	2021-03-11 11:43:37.582896+02	2021-03-11 16:46:07.432545+02	unknown	f
79	unknown	2	187	12	2021	4242	George Krachtopoulos	f	17	card_1ITvTgFMzPANwdsqL2H0uuX8	2021-03-11 18:26:49.541202+02	2021-03-11 18:26:27.79468+02	2021-03-11 18:26:49.541202+02	unknown	f
81	unknown	2	187	12	2022	4242	George Krachtopoul	f	17	card_1ITvceFMzPANwdsqx4sJr33p	2021-03-11 18:37:37.183417+02	2021-03-11 18:35:43.908856+02	2021-03-11 18:37:37.183417+02	unknown	f
83	unknown	2	187	12	2022	4242	George Krachtopoul	f	17	card_1ITvoHFMzPANwdsqpc5mxU6g	2021-03-11 18:48:54.910776+02	2021-03-11 18:47:44.105601+02	2021-03-11 18:48:54.910776+02	unknown	f
20	unknown	2	3	10	2021	4242	George Krac	f	17	card_1Gz6niFMzPANwdsqY79JWyhN	2021-03-11 15:00:34.316635+02	2020-06-28 23:08:30.871643+03	2021-03-11 15:00:34.316635+02	unknown	f
85	unknown	2	187	8	2022	4242	George Krachtopoul	f	17	card_1ITvraFMzPANwdsqVY0cTn2b	2021-03-11 18:54:24.844737+02	2021-03-11 18:51:10.050278+02	2021-03-11 18:54:24.844737+02	unknown	f
25	unknown	2	187	11	2021	4242	George	f	17	card_1ITjdyFMzPANwdsqpxHIrsoZ	2021-03-11 15:01:02.751261+02	2021-03-11 10:13:19.868003+02	2021-03-11 15:01:02.751261+02	unknown	f
26	unknown	2	187	11	2021	4242	George	f	17	card_1ITjk0FMzPANwdsq9BeaAUjb	2021-03-11 15:01:26.772805+02	2021-03-11 10:19:33.687791+02	2021-03-11 15:01:26.772805+02	unknown	f
27	unknown	2	187	11	2021	4242	George	f	17	card_1ITjlVFMzPANwdsqVlVa3OLN	2021-03-11 15:01:45.177308+02	2021-03-11 10:21:06.896062+02	2021-03-11 15:01:45.177308+02	unknown	f
28	unknown	2	187	11	2021	4242	George	f	17	card_1ITjnTFMzPANwdsqjqoDHM8q	2021-03-11 15:01:48.227455+02	2021-03-11 10:23:08.749115+02	2021-03-11 15:01:48.227455+02	unknown	f
29	unknown	1	187	11	2021	4444	George	f	17	card_1ITjpkFMzPANwdsqojUCvqo0	2021-03-11 15:01:51.255803+02	2021-03-11 10:25:29.251335+02	2021-03-11 15:01:51.255803+02	unknown	f
31	unknown	1	187	11	2021	4444	George	f	17	card_1ITjx1FMzPANwdsqpeb9lnuM	2021-03-11 15:01:58.597753+02	2021-03-11 10:33:00.257743+02	2021-03-11 15:01:58.597753+02	unknown	f
32	unknown	1	187	11	2021	4444	George	f	17	card_1ITjzHFMzPANwdsqVYjuhdIR	2021-03-11 15:02:15.091572+02	2021-03-11 10:35:20.899931+02	2021-03-11 15:02:15.091572+02	unknown	f
33	unknown	1	187	11	2021	4444	George	f	17	card_1ITk3HFMzPANwdsqfxKoah5a	2021-03-11 15:02:16.402351+02	2021-03-11 10:39:28.847636+02	2021-03-11 15:02:16.402351+02	unknown	f
34	unknown	1	187	11	2021	4444	George	f	17	card_1ITkGtFMzPANwdsqBaSbwR2T	2021-03-11 15:02:19.034722+02	2021-03-11 10:53:33.379984+02	2021-03-11 15:02:19.034722+02	unknown	f
35	unknown	2	187	11	2021	4242	George	f	17	card_1ITkI1FMzPANwdsq7lIN8svt	2021-03-11 15:02:21.734045+02	2021-03-11 10:54:42.422008+02	2021-03-11 15:02:21.734045+02	unknown	f
70	unknown	2	187	10	2021	4242	Geo	f	17	card_1ITkfrFMzPANwdsqadNrtnzK	2021-03-11 15:03:09.895546+02	2021-03-11 11:19:20.25486+02	2021-03-11 15:03:09.895546+02	unknown	f
72	unknown	2	187	11	2021	4242	George	f	17	card_1ITkhvFMzPANwdsqx7bVmrmF	2021-03-11 15:03:27.976512+02	2021-03-11 11:21:28.74576+02	2021-03-11 15:03:27.976512+02	unknown	f
74	unknown	2	187	11	2021	4242	George	f	17	card_1ITl3nFMzPANwdsqiDBQGM4V	2021-03-11 18:55:16.123+02	2021-03-11 11:44:04.43603+02	\N	unknown	f
87	unknown	2	187	12	2022	4242	George Krachtopoulos	t	17	card_1ITvw3FMzPANwdsq2kfTkLdd	2021-03-11 18:55:46.087886+02	2021-03-11 18:55:46.087886+02	\N	unknown	f
\.


--
-- Data for Name: card_brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_brand (id, name) FROM stdin;
1	MasterCard
2	Visa
3	AMEX
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, total, "timestamp", deleted_at) FROM stdin;
145	\N	0.00	2021-02-26 13:28:36.114531+02	\N
147	\N	0.00	2021-02-26 13:30:33.828541+02	\N
49	\N	0.00	2021-02-25 22:47:47.098329+02	\N
50	\N	0.00	2021-02-25 23:31:32.235763+02	\N
51	\N	0.00	2021-02-25 23:32:20.001806+02	\N
52	\N	0.00	2021-02-25 23:32:25.957588+02	\N
53	\N	0.00	2021-02-25 23:33:24.52768+02	\N
54	\N	0.00	2021-02-25 23:33:26.497733+02	\N
150	\N	0.00	2021-02-26 13:35:04.857737+02	\N
48	\N	10.00	2021-02-20 22:35:50.21825+02	\N
151	\N	0.00	2021-02-26 13:35:49.999953+02	\N
55	\N	0.00	2021-02-25 23:40:06.509503+02	\N
56	\N	0.00	2021-02-25 23:40:44.279196+02	\N
57	\N	0.00	2021-02-25 23:41:13.133883+02	\N
58	\N	0.00	2021-02-26 08:37:05.195322+02	\N
59	\N	0.00	2021-02-26 08:50:53.456708+02	\N
60	\N	0.00	2021-02-26 08:51:01.944174+02	\N
61	\N	0.00	2021-02-26 08:52:39.315772+02	\N
62	\N	0.00	2021-02-26 08:59:12.06824+02	\N
63	\N	0.00	2021-02-26 09:27:39.648161+02	\N
64	\N	0.00	2021-02-26 09:28:17.565153+02	\N
65	\N	0.00	2021-02-26 09:28:34.162748+02	\N
66	\N	0.00	2021-02-26 09:44:46.124923+02	\N
67	\N	0.00	2021-02-26 10:01:08.691249+02	\N
68	\N	0.00	2021-02-26 10:01:11.733984+02	\N
69	\N	0.00	2021-02-26 10:11:06.78965+02	\N
70	\N	0.00	2021-02-26 10:15:29.732805+02	\N
71	\N	0.00	2021-02-26 10:16:13.879769+02	\N
72	\N	0.00	2021-02-26 10:16:22.710923+02	\N
73	\N	0.00	2021-02-26 10:23:46.693764+02	\N
74	\N	0.00	2021-02-26 10:25:43.997+02	\N
75	\N	0.00	2021-02-26 10:50:27.158605+02	\N
76	\N	0.00	2021-02-26 10:50:43.804276+02	\N
77	\N	0.00	2021-02-26 10:50:51.689649+02	\N
78	\N	0.00	2021-02-26 10:51:13.613458+02	\N
79	\N	0.00	2021-02-26 10:51:20.923326+02	\N
80	\N	0.00	2021-02-26 10:51:40.107069+02	\N
81	\N	0.00	2021-02-26 10:52:26.725296+02	\N
82	\N	0.00	2021-02-26 10:53:06.874198+02	\N
83	\N	0.00	2021-02-26 10:54:35.309337+02	\N
84	\N	0.00	2021-02-26 10:54:59.927176+02	\N
85	\N	0.00	2021-02-26 10:56:15.497841+02	\N
86	\N	0.00	2021-02-26 10:57:52.879231+02	\N
87	\N	0.00	2021-02-26 11:01:13.426176+02	\N
88	\N	0.00	2021-02-26 11:01:13.429608+02	\N
89	\N	0.00	2021-02-26 11:01:49.548118+02	\N
90	\N	0.00	2021-02-26 11:01:49.552027+02	\N
91	\N	0.00	2021-02-26 11:01:58.130927+02	\N
92	\N	0.00	2021-02-26 11:01:58.134757+02	\N
93	\N	0.00	2021-02-26 11:02:03.224078+02	\N
94	\N	0.00	2021-02-26 11:02:03.228798+02	\N
95	\N	0.00	2021-02-26 11:02:08.223882+02	\N
96	\N	0.00	2021-02-26 11:02:08.250207+02	\N
97	\N	0.00	2021-02-26 11:02:12.353244+02	\N
98	\N	0.00	2021-02-26 11:02:12.361145+02	\N
99	\N	0.00	2021-02-26 11:02:22.591259+02	\N
100	\N	0.00	2021-02-26 11:02:22.595867+02	\N
101	\N	0.00	2021-02-26 11:28:42.234591+02	\N
102	\N	0.00	2021-02-26 11:30:58.920391+02	\N
103	\N	0.00	2021-02-26 11:30:58.921861+02	\N
104	\N	0.00	2021-02-26 11:31:08.781064+02	\N
105	\N	0.00	2021-02-26 11:31:08.783766+02	\N
106	\N	0.00	2021-02-26 11:33:26.588766+02	\N
107	\N	0.00	2021-02-26 11:48:36.952611+02	\N
108	\N	0.00	2021-02-26 11:53:26.994418+02	\N
109	\N	0.00	2021-02-26 12:33:52.716588+02	\N
110	\N	0.00	2021-02-26 12:35:57.336218+02	\N
111	\N	0.00	2021-02-26 12:36:02.928906+02	\N
112	\N	0.00	2021-02-26 12:38:00.794821+02	\N
113	\N	0.00	2021-02-26 12:38:25.040186+02	\N
114	\N	0.00	2021-02-26 12:38:25.060127+02	\N
115	\N	0.00	2021-02-26 12:38:56.106224+02	\N
116	\N	0.00	2021-02-26 12:39:01.572316+02	\N
117	\N	0.00	2021-02-26 12:39:25.928817+02	\N
118	\N	0.00	2021-02-26 12:40:05.346876+02	\N
119	\N	0.00	2021-02-26 12:40:17.033728+02	\N
120	\N	0.00	2021-02-26 12:40:21.979608+02	\N
121	\N	0.00	2021-02-26 12:55:32.52107+02	\N
122	\N	0.00	2021-02-26 12:55:47.595176+02	\N
153	\N	0.00	2021-02-26 13:39:02.982387+02	\N
127	\N	0.00	2021-02-26 13:02:56.687758+02	\N
155	\N	0.00	2021-02-26 13:40:46.06673+02	\N
123	\N	0.00	2021-02-26 12:56:51.684793+02	\N
156	\N	0.00	2021-02-26 13:40:53.425904+02	\N
157	\N	0.00	2021-02-26 13:41:48.88331+02	\N
141	\N	0.00	2021-02-26 13:24:52.827944+02	\N
142	\N	0.00	2021-02-26 13:25:11.983932+02	\N
158	\N	0.00	2021-02-26 13:41:57.012682+02	\N
161	\N	0.00	2021-02-26 13:43:20.33354+02	\N
162	\N	0.00	2021-02-26 13:43:31.474737+02	\N
163	\N	0.00	2021-02-26 13:43:55.417616+02	\N
130	\N	0.00	2021-02-26 13:05:14.5592+02	\N
136	\N	0.00	2021-02-26 13:13:55.89396+02	\N
164	\N	0.00	2021-02-26 13:44:13.371945+02	\N
128	\N	0.00	2021-02-26 13:03:14.753246+02	\N
124	\N	0.00	2021-02-26 12:59:24.864669+02	\N
166	\N	0.00	2021-02-26 13:45:29.529494+02	\N
143	\N	0.00	2021-02-26 13:26:16.069658+02	\N
134	\N	0.00	2021-02-26 13:07:59.236688+02	\N
167	\N	0.00	2021-02-26 13:46:10.48053+02	\N
168	\N	0.00	2021-02-26 13:49:01.502343+02	\N
169	\N	0.00	2021-02-26 13:49:14.547307+02	\N
137	\N	0.00	2021-02-26 13:17:20.658473+02	\N
170	\N	0.00	2021-02-26 13:49:32.887535+02	\N
171	\N	0.00	2021-02-26 13:50:28.72246+02	\N
138	\N	0.00	2021-02-26 13:20:37.310024+02	\N
172	\N	0.00	2021-02-26 13:51:30.200575+02	\N
173	\N	0.00	2021-02-26 13:52:27.741523+02	\N
129	\N	0.00	2021-02-26 13:04:11.498038+02	\N
174	\N	0.00	2021-02-26 13:54:22.516355+02	\N
175	\N	0.00	2021-02-26 13:56:19.86232+02	\N
176	\N	0.00	2021-02-26 13:57:47.785988+02	\N
135	\N	0.00	2021-02-26 13:13:24.106495+02	\N
131	\N	0.00	2021-02-26 13:05:43.882391+02	\N
125	\N	0.00	2021-02-26 13:02:17.777453+02	\N
177	\N	0.00	2021-02-26 14:02:04.676038+02	\N
178	\N	0.00	2021-02-26 14:03:40.986375+02	\N
180	\N	0.00	2021-02-26 14:14:46.084646+02	\N
181	\N	0.00	2021-02-26 14:42:53.918676+02	\N
182	\N	0.00	2021-02-26 14:52:11.385581+02	\N
183	\N	0.00	2021-02-26 14:52:41.210639+02	\N
184	\N	0.00	2021-02-26 14:55:01.1189+02	\N
140	\N	0.00	2021-02-26 13:24:33.809136+02	\N
185	\N	0.00	2021-02-26 14:59:15.720396+02	\N
126	\N	0.00	2021-02-26 13:02:40.971202+02	\N
187	\N	0.00	2021-02-26 15:03:11.910842+02	\N
189	\N	0.00	2021-02-26 15:12:12.69039+02	\N
190	\N	0.00	2021-02-26 15:12:33.364138+02	\N
132	\N	0.00	2021-02-26 13:06:00.700036+02	\N
133	\N	0.00	2021-02-26 13:07:01.262605+02	\N
191	\N	0.00	2021-02-26 15:12:40.197271+02	\N
195	\N	0.00	2021-02-26 15:14:46.392159+02	\N
197	\N	0.00	2021-02-26 15:26:58.20406+02	\N
201	\N	0.00	2021-02-26 15:27:28.221455+02	\N
202	\N	0.00	2021-02-26 15:27:30.895399+02	\N
203	\N	0.00	2021-02-26 15:27:55.10447+02	\N
204	\N	0.00	2021-02-26 15:27:58.265535+02	\N
211	\N	0.00	2021-02-26 15:30:53.112851+02	\N
212	\N	0.00	2021-02-26 15:36:38.340531+02	\N
213	\N	0.00	2021-02-26 15:36:54.149525+02	\N
214	\N	0.00	2021-02-26 15:44:19.502666+02	\N
196	\N	0.00	2021-02-26 15:15:01.186955+02	\N
139	\N	0.00	2021-02-26 13:21:05.073442+02	\N
198	\N	0.00	2021-02-26 15:26:58.808806+02	\N
152	\N	0.00	2021-02-26 13:36:55.534434+02	\N
192	\N	0.00	2021-02-26 15:13:08.257078+02	\N
144	\N	0.00	2021-02-26 13:26:47.169609+02	\N
199	\N	0.00	2021-02-26 15:27:07.66296+02	\N
200	\N	0.00	2021-02-26 15:27:14.596234+02	\N
205	\N	0.00	2021-02-26 15:28:22.940914+02	\N
206	\N	0.00	2021-02-26 15:28:26.937722+02	\N
215	\N	0.00	2021-02-26 15:46:09.080202+02	\N
146	\N	0.00	2021-02-26 13:29:26.195711+02	\N
148	\N	0.00	2021-02-26 13:32:38.422489+02	\N
159	\N	0.00	2021-02-26 13:42:08.151238+02	\N
160	\N	0.00	2021-02-26 13:42:16.070169+02	\N
210	\N	0.00	2021-02-26 15:29:44.286393+02	\N
165	\N	0.00	2021-02-26 13:45:12.084292+02	\N
154	\N	0.00	2021-02-26 13:40:26.895232+02	\N
149	\N	0.00	2021-02-26 13:32:55.27006+02	\N
193	\N	0.00	2021-02-26 15:13:44.405558+02	\N
216	\N	0.00	2021-02-26 15:50:35.142622+02	\N
207	\N	0.00	2021-02-26 15:29:08.982402+02	\N
179	\N	0.00	2021-02-26 14:11:18.74453+02	\N
186	\N	0.00	2021-02-26 15:01:56.706585+02	\N
194	\N	0.00	2021-02-26 15:14:09.817783+02	\N
208	\N	0.00	2021-02-26 15:29:25.632247+02	\N
209	\N	0.00	2021-02-26 15:29:37.391901+02	\N
188	\N	0.00	2021-02-26 15:04:32.958753+02	\N
217	\N	0.00	2021-02-26 21:51:10.542944+02	\N
218	\N	0.00	2021-02-26 21:53:34.060641+02	\N
47	107	105.40	2020-07-22 00:16:59.169388+03	\N
\.


--
-- Data for Name: cart_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_product (cart_id, product_id, quantity, updated_at, "timestamp", deleted_at, date, time_id) FROM stdin;
47	105	2	2021-02-27 01:36:54.904386+02	2020-07-22 00:17:18.38024+03	2021-02-26 14:55:49.785884+02	2020-07-21	13
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:39:00.14683+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:49:27.990406+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:50:26.752632+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:51:21.131596+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:52:24.515689+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 13:54:16.506011+02	2021-02-26 14:55:49.785884+02	2021-02-26	12
47	64	3	2021-03-12 10:52:36.582751+02	2021-03-12 10:52:36.582751+02	\N	2021-04-16	12
47	64	3	2021-03-12 11:44:08.808634+02	2021-03-12 11:44:08.808634+02	\N	2021-04-16	16
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:26:35.996928+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:28:24.769687+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:20:48.609621+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:56:11.587623+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:24:48.173205+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:02:11.972329+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:30:29.517686+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:54:43.515724+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:55:55.09077+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:47:15.4188+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:56:05.629255+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:27:23.6357+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:29:41.054188+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:36:45.213637+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:50:52.677452+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:04:33.808378+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:05:57.775739+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:51:10.8596+02	\N	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:09:55.294424+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:12:19.364699+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	105	2	2021-02-27 01:36:54.904386+02	2021-02-26 14:56:15.432974+02	\N	2021-02-26	12
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:02:53.768268+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:03:21.124353+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:58:53.132168+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:02:36.119184+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:07:32.586752+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:08:07.874532+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:41:46.801294+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:13:58.252987+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:52:26.63739+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 23:17:54.796591+02	\N	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:35:20.855265+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:08:37.93357+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:45:28.183445+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 13:58:30.023027+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 14:37:28.499579+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2021-02-26 12:59:20.412617+02	2021-02-26 23:17:43.611824+02	2021-02-26	13
47	98	9	2021-03-01 15:25:33.772862+02	2020-07-23 17:13:24.371074+03	2021-02-26 23:17:43.611824+02	2020-07-23	13
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 15:24:18.871948+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:35:37.127724+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:54:31.449893+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:37:18.684208+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:35:18.524997+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:37:01.090757+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:34:56.414306+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:16:27.872336+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:08:42.046817+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:53:37.300018+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:11:13.981699+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:13:12.314381+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:13:46.089336+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:15:37.673613+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:54:15.775901+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:52:23.703823+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	99	11	2021-02-27 21:34:07.317059+02	2021-02-26 14:55:27.528069+02	2021-02-26 15:51:06.009677+02	2021-02-26	12
47	64	3	2021-03-12 10:43:31.099892+02	2021-03-12 10:43:31.099892+02	\N	2021-04-12	12
\.


--
-- Data for Name: city; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.city (id, name, country_id) FROM stdin;
1	Thessaloniki	1
2	Athens	1
3	Kavala	1
\.


--
-- Data for Name: client_browser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_browser (id, name) FROM stdin;
12	Blazer
20	Chrome
22	Comodo Dragon
23	Dillo
24	Dolphin
13	Bolt
14	Brave
27	Epiphany
28	Facebook
29	Falkon
17	Chimera
16	Camino
30	Fennec
31	Firebird
32	Firefox
33	Flock
15	Bowser
19	Chrome WebView
18	Chrome Headless
34	GSA
35	GoBrowser
36	ICE Browser
21	Chromium
37	IE
38	IEMobile
39	IceApe
26	Edge
25	Doris
40	IceCat
42	Iceweasel
43	Iridium
44	Iron
45	Jasmine
46	K-Meleon
47	Kindle
48	Konqueror
49	LBBROWSER Line
50	Links
53	MIUI Browser
41	IceDragon
57	MetaSr Midori
58	Minimo
62	NetFront
64	Netscape
52	Lynx
66	Oculus Browser
67	OmniWeb
51	Lunascape
55	Maemo
54	Maemo Browser
56	Maxthon
68	Opera Coast
69	Opera Mini
59	Mobile Safari
60	Mosaic
70	Opera Mobi
71	Opera Tablet
72	Opera
63	NetSurf
73	PaleMoon
74	PhantomJS
75	Phoenix
76	Polaris
61	Mozilla
65	NokiaBrowser
77	Puffin
78	QQ
79	QQBrowser
80	QQBrowserLite
81	Quark
82	QupZilla
83	RockMelt
84	Safari
85	Sailfish Browser
86	Samsung Browser
90	Sleipnir
94	Tizen Browser
95	UCBrowser
89	Skyfire
87	SeaMonkey
88	Silk
100	iCab
101	w3m
102	Whale Browser
91	Slim
92	SlimBrowser
93	Swiftfox
96	Vivaldi
97	Waterfox
98	WeChat
99	Yandex
1	2345Explorer
2	360 Browser
4	Android Browser
5	Arora
6	Avant
7	Avast
8	AVG
9	BIDUBrowser
10	Baidu
11	Basilisk
3	Amaya
\.


--
-- Data for Name: client_os; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client_os (id, name) FROM stdin;
1	AIX
3	Android
4	Arch
2	Amiga OS
11	Fedora
12	Firefox OS
13	FreeBSD
6	BeOS
8	CentOS
14	Debian
5	Bada
7	BlackBerry
10	Contiki
9	Chromium OS
15	DragonFly
19	Haiku
22	Joli
17	Gentoo
16	Fuchsia
28	Mandriva
29	MeeGo
18	GNU
20	Hurd
30	Minix
31	Mint
32	Morph OS
21	iOS
33	NetBSD
34	Nintendo
35	OpenBSD
24	Linpus
23	KaiOS
26	Mac OS
25	Linux
36	OpenVMS
37	OS/2
38	Palm
27	Mageia
40	PCLinuxOS
41	Plan9
42	PlayStation
43	QNX
44	RedHat
45	RIM Tablet OS
46	RISC OS
48	Series40
50	Solaris
51	SUSE
52	Symbian
53	Tizen
56	VectorLinux
39	PC-BSD
49	Slackware
47	Sailfish
54	Ubuntu
55	Unix
57	WebOS
58	Windows [Phone/Mobile]
59	Zenwalk
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.country (id, name, calling_code, currency_id, is_eu, alpha_3_code, alpha_2_code) FROM stdin;
104	Maldives	960	78	f	MDV	MV
90	Kuwait	965	67	f	KWT	KW
98	Liechtenstein	423	74	f	LIE	LI
1	Afghanistan	93	1	f	AFG	AF
3	Algeria	213	2	f	DZA	DZ
2	Albania	355	3	f	ALB	AL
4	Andorra	376	1	f	AND	AD
5	Angola	244	4	f	AGO	AO
6	Antigua and Barbuda	1 268	5	f	ATG	AG
7	Argentina	54	6	f	ARG	AR
8	Armenia	374	7	f	ARM	AM
9	Australia	61	8	f	AUS	AU
10	Austria	43	1	t	AUT	AT
11	Azerbaijan	994	9	f	AZE	AZ
12	Bahamas	1 242	10	f	BHS	BS
13	Bahrain	973	11	f	BHR	BH
14	Bangladesh	880	12	f	BGD	BD
15	Barbados	1 246	13	f	BRB	BB
16	Belarus	375	14	f	BLR	BY
17	Belgium	32	1	t	BEL	BE
18	Belize	501	15	f	BLZ	BZ
19	Benin	229	16	f	BEN	BJ
20	Bhutan	975	17	f	BTN	BT
21	Bolivia	591	18	f	BOL	BO
22	Bosnia and Herzegovina	387	19	f	BIH	BA
24	Brazil	55	21	f	BRA	BR
23	Botswana	267	20	f	BWA	BW
25	Bunei	673	22	f	BRN	BN
26	Bulgaria	359	23	t	BGR	BG
27	Burkina Faso	226	10	f	BFA	BF
28	Burundi	257	24	f	BDI	BI
29	Cambodia	855	25	f	KHM	KH
30	Cameroon	237	26	f	CMR	CM
31	Canada	1	27	f	CAN	CA
32	Cape Verde	238	28	f	CPV	CV
33	Central African Republic	236	26	f	CAF	CF
34	Chad	235	26	f	TCD	TD
35	Chile	56	29	f	CHL	CL
36	China	86	30	f	CHN	CN
37	Colombia	57	31	f	COL	CO
38	Comoros	269	32	f	COM	KM
39	Congo (Congo-Brazzaville)	242	26	f	COG	CG
40	Costa Rica	506	33	f	CRI	CR
41	Côte d'Ivoire	225	16	f	CIV	CI
42	Croatia	385	34	f	HRV	HR
43	Cuba	53	35	f	CUB	CU
44	Cyprus	357	1	t	CYP	CY
45	Czechia (Czech Republic)	420	35	t	CZE	CZ
46	Democratic Republic of Congo	243	37	f	COD	CD
47	Denmark	45	38	t	DNK	DK
48	Djibouti	253	39	f	DJI	DJ
49	Dominica	1 767	5	f	DMA	DM
51	Ecuador	593	2	f	ECU	EC
53	El Salvador	503	1	f	SVL	SV
52	Egypt	20	42	f	EGY	EG
54	Equatorial Guinea	240	26	f	GNQ	GQ
55	Eritrea	291	43	f	ERI	ER
56	Estonia	372	1	t	EST	EE
57	Ethiopia	251	44	f	ETH	ET
58	Fiji	679	45	f	FJI	FJ
59	Finland	358	1	t	FIN	FI
60	France	33	1	t	FRA	FR
61	Gabon	241	26	f	GAB	GA
62	Gambia	220	46	f	BMB	GM
63	Georgia	995	47	f	GEO	GE
64	Germany	49	1	t	DEU	DE
65	Ghana	233	48	f	GHA	GH
66	Greece	30	1	t	GRC	GR
67	Grenada	1 473	5	f	GRD	GD
68	Guatemala	502	49	f	GTM	GT
69	Guinea	224	50	f	GIN	GN
70	Guinea-Bissau	245	16	f	GNB	GW
71	Guyana	592	51	f	GUY	GY
72	Haiti	509	52	f	HTI	HT
73	Vatican City	379	1	f	VAT	VA
74	Honduras	504	53	f	HND	HN
75	Hungary	63	54	t	HUN	HU
77	India	91	56	f	IND	IN
78	Indonesia	62	57	f	IDN	ID
79	Iran	98	58	f	IRN	IR
80	Iraq	964	59	f	IRQ	IQ
81	Ireland	353	1	t	IRL	IE
82	Israel	972	60	f	ISR	IL
83	Italy	39	1	t	ITA	IT
84	Jamaica	1 876	61	f	JAM	JM
85	Japan	81	62	f	JPN	JP
86	Jordan	962	63	f	JOR	JO
87	Kazakhstan	7	64	f	KAZ	KZ
88	Kenya	254	65	f	KEN	KE
89	Kiribati	686	66	f	KIR	KI
91	Kyrgyzstan	996	68	f	KGZ	KG
92	Laos	856	69	f	LAO	LA
93	Latvia	371	1	t	LVA	LV
94	Lebanon	961	70	f	LBN	LB
95	Lesotho	255	71	f	LSO	LS
96	Liberia	231	72	f	LBR	LR
97	Libya	218	73	f	LBY	LY
99	Lithuania	370	1	t	LTU	LT
102	Malawi	265	76	f	MWI	MW
103	Malaysia	60	77	f	MYS	MY
105	Mali	223	16	f	MLI	ML
106	Malta	356	1	t	MLT	MT
107	Marshall Islands	692	2	f	MHL	MH
108	Mauritania	222	79	f	MRT	MR
109	Mauritius	230	80	f	MUS	MU
110	Mexico	52	81	f	MEX	MX
111	Micronesia	691	2	f	FSM	FM
112	Moldova	373	82	f	MDA	MD
115	Montenegro	382	1	f	MNE	ME
114	Mongolia	976	83	f	MNG	MN
113	Monaco	377	1	f	MCO	MC
116	Morocco	212	84	f	MAR	MA
118	Myanmar	95	86	f	MMR	MM
119	Namibia	264	87	f	NAM	NA
129	Norway	47	94	f	NOR	NO
139	Portugal	351	1	t	PRT	PT
149	Sao Tome and Principe	239	108	f	STP	ST
159	Somalia	252	115	f	SOM	SO
169	Sweden	46	123	t	SWE	SE
179	Tunisia	216	130	f	TUN	TN
189	Uzbekistan	998	139	f	UZB	UZ
120	Nauru	674	8	f	NRU	NR
130	Oman	968	95	f	OMN	OM
140	Qatar	974	103	f	QAT	QA
150	Saudi Arabia	966	109	f	SAU	SA
160	South Africa	27	116	f	ZAF	ZA
170	Switzerland	41	74	f	CHE	CH
180	Turkey	90	131	f	TUR	TR
190	Vanuatu	678	140	f	VUT	VU
121	Nepal	977	88	f	NPL	NP
131	Pakistan	92	96	f	PAK	PK
141	Romania	40	104	t	ROU	RO
151	Senegal	221	16	f	SEN	SN
161	South Korea	82	117	f	KOR	KR
181	Turkmenistan	993	132	f	TKM	TM
191	Venezuela	58	141	f	VEN	VE
171	Syria	963	124	f	SYR	SY
122	Netherlands	31	1	t	NLD	NL
132	Palau	680	2	f	PLW	PW
142	Russia	7	105	f	RUS	RU
152	Serbia	381	110	f	SRB	RS
162	South Sudan	211	118	f	SSD	SS
172	Tajikistan	992	125	f	TJK	TJ
182	Tuvalu	688	133	f	TUV	TV
192	Vietnam	84	142	f	VNM	VN
123	New Zealand	64	89	f	NZL	NZ
133	Panama	507	97	f	PAN	PA
143	Rwanda	25	106	f	RWA	RW
153	Seychelles	248	111	f	SYC	SC
163	Spain	34	1	t	ESP	ES
173	Tanzania	255	126	f	TZA	TZ
183	Uganda	256	134	f	UGA	UG
193	Yemen	967	143	f	YEM	YE
124	Nicaragua	505	90	f	NIC	NI
134	Papua New Guinea	675	98	f	PNG	PG
144	Saint Kitts and Nevis	1 869	5	f	KNA	KN
154	Sierra Leone	232	112	f	SLE	SL
164	Sri Lanka	94	119	f	LKA	LK
174	Thailand	66	127	f	THA	TH
184	Ukraine	380	135	f	UKR	UA
194	Zambia	260	144	f	ZMB	ZM
125	Niger	227	16	f	NER	NE
185	United Arab Emirates	971	136	f	ARE	AE
135	Paraguay	595	99	f	PRY	PY
145	Saint Lucia	1 758	5	f	LCA	LC
155	Singapore	65	113	f	SGB	SG
165	State of Palestine	970	60	f	PSE	PS
175	East Timor	670	2	f	TLS	TL
195	Zimbabwe	263	146	f	ZWE	ZW
126	Nigeria	234	91	f	NGA	NG
136	Peru	51	100	f	PER	PE
146	Saint Vincent and the Grenadines	1 784	5	f	VCT	VC
156	Slovakia	421	1	t	SVK	SK
166	Sudan	249	120	f	SDN	SD
176	Togo	228	16	f	TGO	TG
186	United Kingdom	44	137	f	GBR	GB
127	North Korea	850	92	f	PRK	KP
137	Philippines	63	101	f	PHL	PH
147	Samoa	685	107	f	WSM	WS
157	Slovenia	386	1	t	SVN	SI
167	Suriname	597	121	f	SUR	SR
177	Tonga	676	128	f	TON	TO
187	United States of America	1	2	f	USA	US
76	Iceland	354	55	f	ISL	IS
100	Luxembourg	352	1	t	LUX	LU
117	Mozambique	258	85	f	MOZ	MZ
128	North Macedonia	389	93	f	MKD	MK
138	Poland	48	102	t	POL	PL
148	San Marino	378	1	f	SMR	SM
158	Solomon Islands	677	114	f	SLB	SB
188	Uruguay	598	138	f	URY	UY
168	Swaziland (Eswatini)	268	122	f	SWZ	SZ
178	Trinidad and Tobago	 1 868	129	f	TTO	TT
101	Madagascar	261	154	f	MDG	MG
50	Dominican Republic	1	40	f	DOM	DO
\.


--
-- Data for Name: coupon_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_code (id, title, ref_code, discount_percentage, is_active, valid_until, times_limit, times_used, updated_at, "timestamp", deleted_at, beach_bar_id) FROM stdin;
1	hey	MQ4X7iX5R58Udm0t_v	50	t	2020-10-10 03:00:00+03	6	5	2020-08-13 23:34:06.936086+03	2020-07-21 23:20:03.448169+03	\N	1
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (id, name, iso_code, symbol, second_symbol) FROM stdin;
1	Euro	EUR	€	\N
2	US Dollar	USD	$	\N
3	Albanian lek	ALL	L	\N
4	Angolan kwanza	AOA	Kz	\N
5	Eastern Caribbean dollar	XCD	$	\N
6	Argentine peso	ARS	$	\N
7	Armenian dram	AMD	֏	\N
8	Australian dollar	AUD	$	\N
9	Azerbaijani manat	AZN	₼	\N
10	Bahamian dollar	BSD	$	\N
11	Bahraini dinar	BHD	.د.ب	\N
12	Bangladeshi taka	BDT	৳	\N
13	Barbadian dollar	BBD	$	\N
14	Belarusian ruble	BYN	Br	\N
15	Belize dollar	BZD	$	\N
16	West African CFA franc	XOF	Fr	\N
17	Bhutanese ngultrum	BTN	Nu.	\N
18	Bolivian boliviano	BOB	Bs.	\N
19	Bosnia and Herzegovina convertible mark	BAM	КМ	\N
20	Botswana pula	BWP	P	\N
21	Brazilian real	BRL	R$	\N
22	Brunei dollar	BND	$	\N
23	Bulgarian lev	BGN	лв.	\N
24	Burundian franc	BIF	Fr	\N
25	Cambodian riel	KHR	៛	\N
26	Central African CFA franc	XAF	Fr	\N
27	Canadian dollar	CAD	$	\N
28	Cape Verdean escudo	CVE	$	\N
29	Chilean peso	CLP	$	\N
30	Chinese yuan	CNY	¥	\N
31	Colombian peso	COP	$	\N
32	Comorian franc	KMF	Fr	\N
33	Costa Rican colón	CRC	₡	\N
34	Croatian kuna	HRK	kn	\N
35	Cuban peso	CUP	$	\N
36	Czech koruna	CZK	Kč	\N
37	Congolese franc	CDF	Fr	\N
38	Danish krone	DKK	kr	\N
39	Djiboutian franc	DJF	Fr	\N
40	Dominican peso	DOP	RD$	\N
42	Egyptian pound	EGP	£	\N
43	Eritrean nakfa	ERN	Nfk	\N
44	Ethiopian birr	ETB	Br	\N
45	Fijian dollar	FJD	$	\N
46	Gambian dalasi	GMD	D	\N
47	Georgian lari	GEL	₾	\N
48	Ghanaian cedi	GHS	₵	\N
49	Guatemalan quetzal	GTQ	Q	\N
50	Guinean franc	GNF	Fr	\N
51	Guyanese dollar	GYD	$	\N
52	Haitian gourde	HTG	G	\N
53	Honduran lempira	HNL	L	\N
54	Hungarian forint	HUF	Ft	\N
55	Icelandic króna	ISK	kr	\N
56	Indian rupee	INR	₹	\N
57	Indonesian rupiah	IDR	Rp	\N
58	Iranian rial	IRR	﷼	\N
59	Iraqi dinar	IQD	ع.د	\N
60	Israeli new shekel	ILS	₪	\N
61	Jamaican dollar	JMD	$	\N
62	Japanese yen	JPY	¥	\N
63	Jordanian dinar	JOD	د.ا	\N
64	Kazakhstani tenge	KZT	₸	\N
65	Kenyan shilling	KES	Sh	\N
66	Kiribati dollar	KID	$	\N
67	Kuwaiti dinar	KWD	د.ك	\N
68	Kyrgyzstani som	KGS	с	\N
69	Lao kip	LAK	₭	\N
70	Lebanese pound	LBP	ل.ل	\N
71	Lesotho loti	LSL	L	\N
72	Liberian dollar	LRD	$	\N
73	Libyan dinar	LYD	ل.د	\N
74	Swiss franc	CHF	Fr.	\N
75	Macanese pataca	MOP	MOP$	\N
76	Malawian kwacha	MWK	MK	\N
77	Malaysian ringgit	MYR	RM	\N
78	Maldivian rufiyaa	MVR	.ރ	\N
79	Mauritanian ouguiya	MRU	UM	\N
80	Mauritian rupee	MUR	Rs	\N
81	Mexican peso	MXN	$	\N
82	Moldovan leu	MDL	L	\N
83	Mongolian tögrög	MNT	₮	\N
84	Moroccan dirham	MAD	د.م.	\N
85	Mozambican metical	MZN	MT	\N
86	Burmese kyat	MMK	Ks	\N
87	Namibian dollar	NAD	$	\N
88	Nepalese rupee	NPR	रू	\N
89	New Zealand dollar	NZD	$	\N
90	Nicaraguan córdoba	NIO	C$	\N
91	Nigerian naira	NGN	₦	\N
92	North Korean won	KPW	₩	\N
93	Macedonian denar	MKD	ден	\N
94	Norwegian krone	NOK	kr	\N
95	Omani rial	OMR	ر.ع.	\N
96	Pakistani rupee	PKR	Rs	\N
97	Panamanian balboa	PAB	B/.	\N
98	Papua New Guinean kina	PGK	K	\N
99	Paraguayan guaraní	PYG	₲	\N
100	Peruvian sol	PEN	S/.	\N
101	Philippine peso	PHP	₱	\N
102	Polish złoty	PLN	zł	\N
103	Qatari riyal	QAR	ر.ق	\N
104	Romanian leu	RON	lei	\N
105	Russian ruble	RUB	₽	\N
106	Rwandan franc	RWF	Fr	\N
107	Samoan tālā	WST	T	\N
108	São Tomé and Príncipe dobra	STN	Db	\N
109	Saudi riyal	SAR	﷼	\N
110	Serbian dinar	RSD	дин.	din.
111	Seychellois rupee	SCR	Rs	\N
112	Sierra Leonean leone	SLL	Le	\N
113	Singapore dollar	SGD	$	\N
114	Solomon Islands dollar	SBD	$	\N
115	Somali shilling	SOS	Sh	\N
116	South African rand	ZAR	R	\N
117	South Korean won	KRW	₩	\N
118	South Sudanese pound	SSP	£	\N
119	Sri Lankan rupee	LKP	Rs	රු
120	Sudanese pound	SDG	ج.س.	\N
121	Surinamese dollar	SRD	$	\N
122	Swazi lilangeni	SZL	L	\N
123	Swedish krona	SEK	kr	\N
124	Syrian pound	SYP	£	ل.س
125	Tajikistani somoni	TJS	SM	\N
126	Tanzanian shilling	TZS	Sh	\N
127	Thai baht	THB	฿	\N
128	Tongan paʻanga	TOP	T$	\N
129	Trinidad and Tobago dollar	TTD	$	\N
130	Tunisian dinar	TND	د.ت	\N
131	Turkish lira	TRY	₺	\N
132	Turkmenistan manat	TMT	m	\N
133	Tuvaluan dollar	TVD	$	\N
134	Ugandan shilling	UGX	Sh	\N
135	Ukrainian hryvnia	UAH	₴	\N
136	United Arab Emirates dirham	AED	د.إ	\N
137	British pound	GBP	£	\N
138	Uruguayan peso	UYU	$	\N
139	Uzbekistani soʻm	UZS	so'm	сўм
140	Vanuatu vatu	VUV	Vt	\N
141	Venezuelan bolívar soberano	VES	Bs.S.	Bs.
142	Vietnamese đồng	VND	₫	\N
143	Yemeni rial	YER	ر.ي	\N
144	Zambian kwacha	ZMW	ZK	\N
146	RTGS dollar	ZWB		\N
154	Malagasy ariary	MGA	Ar	\N
\.


--
-- Data for Name: currency_product_price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency_product_price (id, currency_id, price, updated_at, "timestamp") FROM stdin;
1	1	0.50	2020-06-23 17:34:27.515319+03	2020-06-23 17:34:27.515319+03
2	2	0.60	2020-06-23 17:34:48.52593+03	2020-06-23 17:34:48.52593+03
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, user_id, stripe_customer_id, updated_at, "timestamp", deleted_at, phone_number, country_id, email) FROM stdin;
10	\N	cus_HXjnSR5uaTp3SE	2020-06-27 16:44:04.242728+03	2020-06-27 16:44:04.242728+03	\N	\N	\N	hey@gmail.com
11	\N	cus_HXlVWcQv5tYpDJ	2020-06-27 18:30:47.571724+03	2020-06-27 18:29:20.576264+03	2020-06-27 18:30:47.571724+03	\N	\N	hey@gmail.com
12	\N	cus_HXleU8fXs23DHn	2020-06-27 18:39:05.656694+03	2020-06-27 18:38:31.929631+03	2020-06-27 18:39:05.656694+03	\N	\N	hey@gmail.com
13	\N	cus_HXll3vgEF15VoW	2020-06-27 18:46:36.775928+03	2020-06-27 18:45:35.14557+03	2020-06-27 18:46:36.775928+03	\N	\N	hey@gmail.com
14	\N	cus_HXltByZd3TDtv6	2020-06-27 18:56:12.794772+03	2020-06-27 18:53:23.438953+03	2020-06-27 18:56:12.794772+03	\N	\N	hey@gmail.com
15	\N	cus_HXm2L7BgXg0Wg8	2020-06-27 19:03:47.036052+03	2020-06-27 19:02:54.089645+03	2020-06-27 19:03:47.036052+03	\N	\N	hey@gmail.com
16	\N	cus_HXm4B3NEAR1vDO	2020-06-27 19:05:18.556949+03	2020-06-27 19:05:18.556949+03	\N	\N	\N	hey@gmail.com
18	\N	cus_HY3eELMkUiqMYi	2020-06-28 13:14:31.010803+03	2020-06-28 13:14:31.010803+03	\N	\N	\N	hey@gmail.com
19	\N	cus_HY3lRdpX1yxzIg	2020-06-28 13:21:19.893402+03	2020-06-28 13:21:19.893402+03	\N	\N	\N	hey@gmail.com
20	\N	cus_HY3pK8kWshGRrV	2020-06-28 13:25:31.126195+03	2020-06-28 13:25:31.126195+03	\N	\N	\N	hey@gmail.com
21	\N	cus_HY6yCSjKqcndne	2020-06-28 16:41:15.317533+03	2020-06-28 16:41:15.317533+03	\N	\N	\N	hey@gmail.com
24	\N	cus_HY7LhMaZh4783n	2020-06-28 17:04:00.731564+03	2020-06-28 17:04:00.731564+03	\N	\N	\N	hey@gmail.com
25	\N	cus_HY7b35IPuRu1SZ	2020-06-28 17:19:50.944326+03	2020-06-28 17:19:50.944326+03	\N	\N	\N	hey@gmail.com
26	\N	cus_HY7i8XTnWun0BS	2020-06-28 17:26:49.689719+03	2020-06-28 17:26:49.689719+03	\N	\N	\N	hey@gmail.com
27	\N	cus_HY7nPul0wpslbC	2020-06-28 17:32:36.425792+03	2020-06-28 17:32:12.4812+03	2020-06-28 17:32:36.425792+03	\N	\N	hey@gmail.com
28	\N	cus_HY7oLkidZ06TBc	2020-06-28 17:33:21.410501+03	2020-06-28 17:32:54.2979+03	2020-06-28 17:33:21.410501+03	\N	\N	hey@gmail.com
29	\N	cus_HY8ff5iejxYGLc	2020-06-28 18:25:55.040716+03	2020-06-28 18:25:55.040716+03	\N	\N	\N	hey@gmail.com
22	\N	cus_HY75tVYMEZj4Qi	2020-06-28 19:53:17.63261+03	2020-06-28 16:48:07.963561+03	2020-06-28 19:53:17.63261+03	\N	\N	hey@gmail.com
23	\N	cus_HY7DrOcbWiT4DL	2020-06-28 19:57:54.855768+03	2020-06-28 16:56:08.515784+03	2020-06-28 19:57:54.855768+03	\N	\N	hey@gmail.com
17	107	cus_HXmpZwzSUDPvz7	2020-06-27 19:51:30.778276+03	2020-06-27 19:51:30.778276+03	\N	6975954916	66	hey@gmail.com
\.


--
-- Data for Name: hour_time; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hour_time (id, value) FROM stdin;
1	01:00:00
2	02:00:00
3	03:00:00
4	04:00:00
5	05:00:00
6	06:00:00
7	07:00:00
8	08:00:00
9	09:00:00
10	10:00:00
11	11:00:00
12	12:00:00
13	13:00:00
14	14:00:00
16	16:00:00
15	15:00:00
17	17:00:00
18	18:00:00
19	19:00:00
20	20:00:00
21	21:00:00
22	22:00:00
23	23:00:00
24	24:00:00
\.


--
-- Data for Name: login_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_details (id, account_id, status, os_id, browser_id, country_id, ip_addr, "timestamp", platform_id, city) FROM stdin;
2	101	failed	\N	\N	\N	\N	2020-10-16 21:44:02.434381+03	1	\N
3	101	failed	\N	\N	\N	\N	2020-10-16 21:45:10.12315+03	1	\N
4	101	failed	\N	\N	\N	\N	2020-10-16 21:45:39.340816+03	1	\N
5	101	failed	\N	\N	\N	\N	2020-10-16 21:46:36.7359+03	1	\N
6	101	failed	\N	\N	\N	\N	2020-10-18 20:02:46.91776+03	1	\N
7	101	failed	\N	\N	\N	\N	2020-10-18 20:17:06.326445+03	1	\N
8	101	logged_in	\N	\N	\N	\N	2020-10-18 20:18:48.044004+03	1	\N
9	101	logged_in	\N	\N	\N	\N	2020-10-18 20:20:30.738397+03	1	\N
10	101	failed	\N	\N	\N	\N	2021-02-21 18:37:54.100591+02	1	\N
11	101	failed	\N	\N	\N	\N	2021-02-21 18:40:30.211027+02	1	\N
12	101	failed	\N	\N	\N	\N	2021-02-21 18:41:18.982283+02	1	\N
13	101	failed	\N	\N	\N	\N	2021-02-21 18:42:08.131667+02	1	\N
14	101	failed	\N	\N	\N	\N	2021-02-21 18:42:32.05327+02	1	\N
15	101	failed	\N	\N	\N	\N	2021-02-21 18:42:56.159576+02	1	\N
16	101	logged_in	\N	\N	\N	\N	2021-02-21 18:43:30.372768+02	1	\N
17	101	logged_in	\N	\N	\N	\N	2021-02-21 18:45:32.207169+02	1	\N
18	101	logged_in	\N	\N	\N	\N	2021-02-21 18:46:54.499422+02	1	\N
19	101	logged_in	\N	\N	\N	\N	2021-02-21 18:48:06.047406+02	1	\N
20	101	logged_in	\N	\N	\N	\N	2021-02-21 18:51:50.962031+02	1	\N
21	101	logged_in	\N	\N	\N	\N	2021-02-21 18:55:00.93933+02	1	\N
22	101	logged_in	\N	\N	\N	\N	2021-02-21 19:10:37.991909+02	1	\N
23	101	logged_in	\N	\N	\N	\N	2021-02-21 19:10:55.661478+02	1	\N
24	101	logged_in	\N	\N	\N	\N	2021-02-21 19:11:29.729578+02	1	\N
25	101	logged_in	\N	\N	\N	\N	2021-02-21 19:56:33.112734+02	1	\N
26	101	logged_in	\N	\N	\N	\N	2021-02-21 19:56:45.228187+02	1	\N
27	101	logged_in	\N	\N	\N	\N	2021-02-21 19:57:27.685296+02	1	\N
28	101	logged_in	\N	\N	\N	\N	2021-02-21 20:03:42.594+02	1	\N
29	101	logged_in	\N	\N	\N	\N	2021-02-21 20:04:44.40379+02	1	\N
30	101	logged_in	\N	\N	\N	\N	2021-02-21 20:17:56.372627+02	1	\N
31	101	logged_in	\N	\N	\N	\N	2021-02-21 20:18:42.567665+02	1	\N
32	101	logged_in	\N	\N	\N	\N	2021-02-21 20:19:23.293226+02	1	\N
33	101	logged_in	\N	\N	\N	\N	2021-02-21 20:32:32.857574+02	1	\N
34	101	logged_in	\N	\N	\N	\N	2021-02-21 20:36:09.250273+02	1	\N
35	101	logged_in	\N	\N	\N	127.0.0.1/32	2021-02-21 20:40:09.834949+02	1	\N
36	101	logged_in	\N	\N	\N	\N	2021-02-21 22:42:08.298197+02	1	\N
37	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-21 23:03:32.071392+02	1	\N
38	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-21 23:07:26.609656+02	1	\N
39	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-21 23:39:34.941595+02	1	\N
40	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 08:27:46.922424+02	1	\N
41	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 08:37:14.066114+02	1	\N
42	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 09:29:21.75268+02	1	\N
43	101	logged_in	\N	\N	\N	\N	2021-02-22 10:24:46.429011+02	1	\N
44	101	logged_in	\N	\N	\N	\N	2021-02-22 12:26:38.496784+02	1	\N
45	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:07:22.849367+02	1	\N
46	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:08:02.284659+02	1	\N
47	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:12:35.285773+02	1	\N
48	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:14:52.935922+02	1	\N
49	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:15:27.641123+02	1	\N
50	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:16:21.942382+02	1	\N
51	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:40:31.625593+02	1	\N
52	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:42:28.102695+02	1	\N
53	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:44:21.765667+02	1	\N
54	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:45:39.909097+02	1	\N
55	101	logged_in	\N	\N	\N	\N	2021-02-22 14:46:22.586967+02	1	\N
56	101	logged_in	\N	\N	\N	\N	2021-02-22 14:47:21.479456+02	1	\N
57	101	logged_in	\N	\N	\N	\N	2021-02-22 14:48:18.119994+02	1	\N
58	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:50:01.161361+02	1	\N
59	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:52:08.209502+02	1	\N
60	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:53:20.469006+02	1	\N
61	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:54:15.306024+02	1	\N
62	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:06.038636+02	1	\N
63	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:25.971635+02	1	\N
64	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:56.596983+02	1	\N
65	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:56:16.999139+02	1	\N
66	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:57:24.61021+02	1	\N
67	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:58:08.685519+02	1	\N
68	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:59:11.809932+02	1	\N
69	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 14:59:19.5616+02	1	\N
70	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 15:02:41.134646+02	1	\N
71	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 15:03:28.515989+02	1	\N
72	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 15:07:48.813445+02	1	\N
73	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 15:15:36.963346+02	1	\N
74	101	failed	\N	\N	\N	87.203.202.178/32	2021-02-22 15:16:47.622808+02	1	\N
75	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-22 15:16:48.131045+02	1	\N
76	101	logged_in	\N	\N	\N	\N	2021-02-25 23:33:15.995991+02	1	\N
77	101	logged_in	\N	\N	\N	\N	2021-02-25 23:33:53.255653+02	1	\N
78	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-25 23:36:10.379914+02	1	\N
79	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 08:53:54.479263+02	1	\N
80	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 10:01:39.671416+02	1	\N
81	101	logged_in	\N	\N	\N	\N	2021-02-26 10:16:21.156403+02	1	\N
82	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 10:53:44.59606+02	1	\N
83	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 11:28:23.470733+02	1	\N
84	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 12:39:20.317442+02	1	\N
85	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 12:40:36.428347+02	1	\N
86	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 13:42:40.678398+02	1	\N
87	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 14:43:07.607158+02	1	\N
88	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 15:46:52.457677+02	1	\N
89	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 21:52:09.634831+02	1	\N
90	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 22:05:12.678748+02	1	\N
91	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 23:31:17.528479+02	1	\N
92	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-26 23:51:04.285556+02	1	\N
93	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-27 00:54:33.365342+02	1	\N
94	101	logged_in	\N	\N	\N	87.203.202.178/32	2021-02-27 00:58:06.305351+02	1	\N
109	101	logged_in	\N	\N	\N	\N	2021-02-27 17:33:59.921812+02	1	\N
110	101	logged_in	\N	\N	\N	\N	2021-02-27 17:34:15.068906+02	1	\N
111	101	logged_in	\N	\N	\N	\N	2021-02-27 17:35:00.178173+02	1	\N
112	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-02-27 17:47:36.937241+02	1	\N
113	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-02-27 18:12:38.89996+02	1	\N
114	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-02-27 21:22:46.684623+02	1	\N
115	101	logged_in	\N	\N	\N	\N	2021-02-28 20:08:18.946155+02	1	\N
116	101	logged_in	\N	\N	\N	\N	2021-02-28 21:36:11.67866+02	1	\N
117	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-02-28 21:41:17.793838+02	1	\N
118	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-02-28 22:54:10.329096+02	1	\N
119	101	logged_in	\N	\N	\N	\N	2021-02-28 23:43:30.74799+02	1	\N
120	101	logged_in	\N	\N	\N	\N	2021-03-01 08:35:29.609885+02	1	\N
121	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 08:47:44.243846+02	1	\N
122	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 09:48:21.933521+02	1	\N
123	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 10:53:15.081561+02	1	\N
124	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 11:55:18.256676+02	1	\N
125	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 13:39:01.844361+02	1	\N
126	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 14:42:48.916829+02	1	\N
127	101	logged_in	\N	\N	\N	\N	2021-03-01 20:40:15.556317+02	1	\N
128	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 20:52:24.318521+02	1	\N
129	101	logged_in	\N	\N	\N	\N	2021-03-01 21:31:36.514411+02	1	\N
130	101	logged_in	\N	\N	\N	\N	2021-03-01 21:57:20.518853+02	1	\N
131	101	logged_in	\N	\N	\N	\N	2021-03-01 22:22:02.849243+02	1	\N
132	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 22:49:46.141734+02	1	\N
133	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-01 22:49:51.446684+02	1	\N
134	101	logged_in	\N	\N	\N	\N	2021-03-01 23:12:39.877577+02	1	\N
135	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 08:39:58.415279+02	1	\N
136	101	logged_in	\N	\N	\N	\N	2021-03-02 08:42:27.110762+02	1	\N
137	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 09:00:56.967479+02	1	\N
138	101	logged_in	\N	\N	\N	\N	2021-03-02 09:13:34.002035+02	1	\N
139	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 09:13:51.948963+02	1	\N
140	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 09:31:55.450912+02	1	\N
141	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 13:47:35.972693+02	1	\N
142	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 17:47:02.952311+02	1	\N
143	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 20:27:15.459287+02	1	\N
144	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 20:27:22.081574+02	1	\N
145	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 20:29:20.032388+02	1	\N
146	101	logged_in	\N	\N	\N	\N	2021-03-02 21:17:41.684498+02	1	\N
147	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 21:19:53.547974+02	1	\N
148	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-02 22:34:35.047283+02	1	\N
149	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 10:27:36.297536+02	1	\N
150	101	logged_in	\N	\N	\N	\N	2021-03-03 10:28:54.833287+02	1	\N
151	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 10:36:54.891253+02	1	\N
152	101	failed	\N	\N	\N	80.106.83.2/32	2021-03-03 11:38:56.970729+02	1	\N
153	101	failed	\N	\N	\N	80.106.83.2/32	2021-03-03 11:39:51.814414+02	1	\N
154	101	failed	\N	\N	\N	80.106.83.2/32	2021-03-03 11:40:07.994855+02	1	\N
155	101	failed	\N	\N	\N	\N	2021-03-03 11:40:24.050102+02	1	\N
156	101	failed	\N	\N	\N	\N	2021-03-03 11:43:47.239714+02	1	\N
157	101	failed	\N	\N	\N	\N	2021-03-03 11:46:20.640107+02	1	\N
158	101	logged_in	\N	\N	\N	\N	2021-03-03 11:48:46.525181+02	1	\N
159	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 11:48:54.165399+02	1	\N
160	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 13:10:30.421764+02	1	\N
161	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 13:42:28.307814+02	1	\N
162	101	logged_in	\N	\N	\N	\N	2021-03-03 13:49:12.384615+02	1	\N
163	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 14:42:02.689784+02	1	\N
164	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 15:48:22.415776+02	1	\N
165	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-03 20:51:22.012299+02	1	\N
166	101	logged_in	\N	\N	\N	\N	2021-03-03 21:04:34.637664+02	1	\N
175	101	logged_in	\N	\N	\N	\N	2021-03-04 09:14:32.393845+02	1	\N
176	101	logged_in	\N	\N	\N	\N	2021-03-04 09:23:36.566558+02	1	\N
177	101	logged_in	\N	\N	\N	\N	2021-03-04 09:35:15.331665+02	1	\N
178	101	logged_in	\N	\N	\N	\N	2021-03-04 09:35:25.948029+02	1	\N
179	101	logged_in	\N	\N	\N	\N	2021-03-04 09:37:44.459059+02	1	\N
240	101	logged_in	\N	\N	\N	\N	2021-03-07 16:39:48.254176+02	1	Thessaloniki
180	101	logged_in	\N	\N	\N	\N	2021-03-04 10:29:47.67441+02	1	\N
181	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:31:04.185035+02	1	\N
182	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:45:59.665441+02	1	\N
183	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:48:27.628792+02	1	\N
184	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:49:25.40567+02	1	\N
185	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:49:46.981761+02	1	\N
186	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:50:17.222135+02	1	\N
187	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 10:57:16.908911+02	1	\N
188	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:01:14.349916+02	1	\N
189	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:02:11.957873+02	1	\N
190	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:03:44.769391+02	1	\N
191	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:04:56.990985+02	1	\N
192	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:06:46.446505+02	1	\N
193	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:12:14.246676+02	1	\N
194	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:16:19.262554+02	1	\N
195	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 11:44:56.296512+02	1	\N
196	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 14:46:33.582934+02	1	\N
197	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 15:23:45.282001+02	1	\N
198	101	logged_in	\N	\N	\N	80.106.83.2/32	2021-03-04 15:23:57.189855+02	1	\N
199	101	logged_in	\N	\N	\N	\N	2021-03-04 16:07:13.349513+02	1	\N
200	101	logged_in	\N	\N	\N	\N	2021-03-04 16:07:48.062272+02	1	\N
201	101	logged_in	\N	\N	\N	\N	2021-03-04 16:08:08.284843+02	1	\N
202	101	logged_in	\N	\N	\N	\N	2021-03-04 16:08:29.455248+02	1	\N
203	101	logged_in	\N	\N	\N	\N	2021-03-04 16:14:53.310903+02	1	\N
204	101	logged_in	\N	\N	\N	\N	2021-03-04 16:15:03.462158+02	1	\N
205	101	logged_in	\N	\N	\N	\N	2021-03-04 16:15:08.222119+02	1	\N
206	101	logged_in	\N	\N	\N	\N	2021-03-04 16:34:10.839886+02	1	\N
207	101	logged_in	\N	\N	\N	\N	2021-03-04 16:34:45.667947+02	1	\N
208	101	logged_in	\N	\N	\N	\N	2021-03-04 16:35:52.374181+02	1	\N
209	101	logged_in	\N	\N	\N	\N	2021-03-04 16:36:13.822725+02	1	\N
210	101	logged_in	\N	\N	\N	\N	2021-03-04 16:36:17.807152+02	1	\N
211	101	logged_in	\N	\N	\N	\N	2021-03-04 16:37:48.683234+02	1	\N
212	101	logged_in	\N	\N	\N	\N	2021-03-04 16:38:19.739497+02	1	\N
213	101	logged_in	\N	\N	\N	\N	2021-03-04 16:38:47.684755+02	1	\N
214	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-04 16:48:00.789399+02	1	\N
215	101	logged_in	\N	\N	\N	\N	2021-03-04 16:51:04.734181+02	1	\N
216	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-04 23:35:11.027379+02	1	\N
217	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-05 08:45:09.408767+02	1	\N
218	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-05 08:50:32.996499+02	1	\N
219	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-05 09:36:51.717082+02	1	\N
220	101	logged_in	\N	\N	\N	87.203.201.94/32	2021-03-05 09:42:31.337508+02	1	\N
221	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-05 11:27:42.21203+02	1	\N
222	101	logged_in	\N	\N	\N	\N	2021-03-05 15:34:57.047993+02	1	\N
223	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-05 16:24:27.172002+02	1	\N
224	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-05 16:32:52.900332+02	1	\N
225	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 15:41:35.521248+02	1	\N
226	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:05.464509+02	1	\N
227	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:08.559771+02	1	\N
228	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:11.438867+02	1	\N
229	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:36.269114+02	1	\N
230	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:10.045876+02	1	\N
231	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:30.908965+02	1	\N
232	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:49.358352+02	1	\N
233	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-06 23:35:26.284704+02	1	\N
234	101	invalid_password	\N	\N	\N	94.69.16.206/32	2021-03-06 23:49:37.912279+02	1	\N
235	101	invalid_password	\N	\N	\N	94.69.16.206/32	2021-03-06 23:54:19.046971+02	1	\N
236	101	invalid_password	\N	\N	\N	94.69.16.206/32	2021-03-06 23:54:52.085343+02	1	\N
237	101	invalid_password	\N	\N	\N	94.69.16.206/32	2021-03-06 23:55:18.177291+02	1	\N
238	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-07 14:02:54.000175+02	1	\N
239	101	logged_in	\N	\N	\N	94.69.16.206/32	2021-03-07 14:03:07.70243+02	1	\N
241	101	logged_in	\N	\N	\N	\N	2021-03-07 16:40:59.887431+02	1	Thessaloniki
242	101	logged_in	\N	\N	\N	\N	2021-03-07 16:41:51.805378+02	1	Thessaloniki
243	101	logged_in	\N	\N	\N	\N	2021-03-07 16:42:21.8957+02	1	Thessaloniki
244	101	logged_in	\N	\N	\N	\N	2021-03-07 16:42:44.840359+02	1	Thessaloniki
245	101	logged_in	\N	\N	66	\N	2021-03-07 17:04:25.137107+02	1	Thessaloniki
246	101	logged_in	\N	\N	66	\N	2021-03-07 17:05:37.847953+02	1	Thessaloniki
247	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-07 17:06:18.00835+02	1	Thessaloniki
248	101	logged_in	21	\N	\N	\N	2021-03-08 12:40:52.116649+02	2	\N
249	101	logged_in	21	\N	\N	\N	2021-03-08 14:15:05.429949+02	2	\N
250	101	logged_in	21	\N	\N	\N	2021-03-08 14:16:35.936213+02	2	\N
251	101	logged_in	21	\N	\N	\N	2021-03-08 14:51:05.979751+02	2	\N
252	101	logged_in	21	\N	\N	\N	2021-03-08 14:52:00.06273+02	2	\N
253	101	logged_in	21	\N	\N	\N	2021-03-08 15:22:40.66255+02	2	\N
254	101	logged_in	21	\N	\N	\N	2021-03-08 18:39:33.185336+02	3	\N
255	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 18:45:25.182391+02	3	Thessaloniki
256	101	logged_in	21	\N	\N	\N	2021-03-08 18:46:10.413419+02	3	\N
257	101	logged_in	21	\N	\N	\N	2021-03-08 18:56:11.992009+02	3	\N
258	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 18:59:31.124589+02	3	Thessaloniki
259	101	logged_in	21	\N	\N	\N	2021-03-08 19:09:12.760503+02	4	\N
260	101	logged_in	21	\N	\N	\N	2021-03-08 19:10:50.13324+02	4	\N
261	101	logged_in	21	\N	\N	\N	2021-03-08 19:13:05.842382+02	4	\N
262	101	logged_in	21	\N	\N	\N	2021-03-08 19:14:17.1532+02	4	\N
263	101	logged_in	21	\N	\N	\N	2021-03-08 19:17:57.23693+02	4	\N
264	101	logged_in	21	\N	\N	\N	2021-03-08 19:19:32.106871+02	4	\N
265	101	logged_in	21	\N	\N	\N	2021-03-08 19:21:39.605806+02	4	\N
266	101	logged_in	21	\N	\N	\N	2021-03-08 19:22:20.517406+02	4	\N
267	101	logged_in	21	\N	\N	\N	2021-03-08 19:24:19.674638+02	4	\N
268	101	logged_in	21	\N	\N	\N	2021-03-08 19:26:07.166826+02	4	\N
269	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 19:35:05.15099+02	4	Thessaloniki
270	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 20:08:51.033235+02	4	Thessaloniki
271	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 20:09:32.367965+02	4	Thessaloniki
272	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-08 20:10:58.364414+02	4	Thessaloniki
273	101	logged_in	21	\N	\N	\N	2021-03-09 08:55:25.188231+02	2	\N
274	101	logged_in	21	\N	\N	\N	2021-03-09 10:21:16.070007+02	2	\N
275	101	failed	21	\N	66	\N	2021-03-09 12:17:30.673027+02	1	Thessaloniki
276	101	logged_in	\N	\N	66	\N	2021-03-09 12:19:03.829035+02	1	Thessaloniki
277	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-09 12:24:28.307843+02	1	Thessaloniki
278	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-09 12:24:31.125453+02	1	Thessaloniki
279	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-09 12:24:39.751101+02	1	Thessaloniki
280	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-09 12:24:58.37966+02	1	Thessaloniki
281	101	logged_in	21	\N	\N	\N	2021-03-09 12:26:03.074718+02	2	\N
282	101	logged_in	21	\N	66	94.69.16.206/32	2021-03-09 13:23:40.414435+02	1	Thessaloniki
283	101	logged_in	\N	\N	66	\N	2021-03-09 14:08:05.574382+02	1	Thessaloniki
284	101	logged_in	\N	\N	66	\N	2021-03-10 08:47:03.33117+02	1	Thessaloniki
285	101	logged_in	\N	\N	66	\N	2021-03-10 08:48:27.851689+02	1	Thessaloniki
286	101	logged_in	\N	\N	66	\N	2021-03-10 09:09:50.118729+02	1	Thessaloniki
287	101	logged_in	\N	\N	66	\N	2021-03-10 15:39:10.817192+02	1	Thessaloniki
288	101	logged_in	\N	\N	66	\N	2021-03-11 09:49:33.055009+02	1	Thessaloniki
289	101	logged_in	\N	\N	66	\N	2021-03-11 10:16:07.590883+02	1	Thessaloniki
290	101	logged_in	\N	\N	66	\N	2021-03-11 10:19:49.300141+02	1	Thessaloniki
291	101	logged_in	\N	\N	66	\N	2021-03-11 12:29:41.268702+02	1	Thessaloniki
292	101	logged_in	\N	\N	66	\N	2021-03-11 13:13:12.278564+02	1	Thessaloniki
293	101	logged_in	\N	\N	66	\N	2021-03-11 14:58:03.328255+02	1	Thessaloniki
294	101	logged_in	\N	\N	66	\N	2021-03-11 15:00:27.153046+02	1	Thessaloniki
295	101	logged_in	\N	\N	66	\N	2021-03-11 15:01:43.263414+02	1	Thessaloniki
296	101	logged_in	\N	\N	66	\N	2021-03-11 15:02:51.103531+02	1	Thessaloniki
297	101	logged_in	\N	\N	66	\N	2021-03-11 15:40:56.746118+02	1	Thessaloniki
298	101	logged_in	\N	\N	66	\N	2021-03-11 16:46:02.632382+02	1	Thessaloniki
299	101	logged_in	\N	\N	66	\N	2021-03-12 09:00:37.90801+02	1	Thessaloniki
300	101	logged_in	\N	\N	66	\N	2021-03-12 09:04:12.377641+02	1	Thessaloniki
301	101	invalid_password	21	\N	66	87.203.208.28/32	2021-03-13 20:09:05.214884+02	1	Thessaloniki
302	101	invalid_password	21	\N	66	87.203.208.28/32	2021-03-13 20:09:17.899486+02	1	Thessaloniki
303	101	invalid_password	21	\N	66	87.203.208.28/32	2021-03-13 20:09:34.52182+02	1	Thessaloniki
304	101	logged_in	21	\N	\N	\N	2021-03-13 20:10:20.643266+02	2	\N
305	101	logged_in	\N	\N	66	\N	2021-03-14 22:54:26.181539+02	1	Thessaloniki
306	101	logged_in	\N	\N	66	\N	2021-03-14 22:56:30.76846+02	1	Thessaloniki
307	101	logged_in	\N	\N	66	\N	2021-03-14 22:57:45.1362+02	1	Thessaloniki
308	101	logged_in	\N	\N	66	\N	2021-03-14 22:59:02.081742+02	1	Thessaloniki
309	101	logged_in	\N	\N	66	\N	2021-03-14 23:00:45.862681+02	1	Thessaloniki
310	101	logged_in	\N	\N	66	\N	2021-03-14 23:02:30.522315+02	1	Thessaloniki
311	101	logged_in	\N	\N	66	\N	2021-03-14 23:03:48.080826+02	1	Thessaloniki
312	101	logged_in	\N	\N	66	\N	2021-03-14 23:04:58.917488+02	1	Thessaloniki
313	101	logged_in	\N	\N	66	\N	2021-03-14 23:07:41.589902+02	1	Thessaloniki
314	101	logged_in	\N	\N	66	\N	2021-03-14 23:08:36.124581+02	1	Thessaloniki
315	101	logged_in	\N	\N	66	\N	2021-03-14 23:09:20.386685+02	1	Thessaloniki
316	101	logged_in	\N	\N	66	\N	2021-03-14 23:10:06.241175+02	1	Thessaloniki
317	101	logged_in	\N	\N	66	\N	2021-03-14 23:11:26.212783+02	1	Thessaloniki
318	101	logged_in	\N	\N	66	\N	2021-03-14 23:12:29.40197+02	1	Thessaloniki
319	101	logged_in	\N	\N	66	\N	2021-03-14 23:13:07.551613+02	1	Thessaloniki
320	101	logged_in	\N	\N	66	\N	2021-03-14 23:19:29.793561+02	1	Thessaloniki
321	101	logged_in	\N	\N	66	\N	2021-03-15 12:19:26.066594+02	1	Thessaloniki
322	101	logged_in	\N	\N	66	\N	2021-03-15 12:24:23.46231+02	1	Thessaloniki
323	101	logged_in	\N	\N	66	\N	2021-03-15 12:26:15.325748+02	1	Thessaloniki
324	101	logged_in	\N	\N	66	\N	2021-03-15 12:27:19.46589+02	1	Thessaloniki
325	101	logged_in	\N	\N	66	\N	2021-03-15 12:29:01.296503+02	1	Thessaloniki
326	101	logged_in	\N	\N	66	\N	2021-03-15 12:46:16.084309+02	1	Thessaloniki
327	101	logged_in	\N	\N	66	\N	2021-03-15 13:15:06.312722+02	1	Thessaloniki
328	101	logged_in	\N	\N	66	\N	2021-03-15 18:44:27.715831+02	1	Thessaloniki
329	101	logged_in	\N	\N	66	\N	2021-03-15 19:47:41.916987+02	1	Thessaloniki
330	101	logged_in	\N	\N	66	\N	2021-03-15 20:02:52.235432+02	1	Thessaloniki
331	101	logged_in	\N	\N	66	\N	2021-03-16 10:31:22.279693+02	1	Thessaloniki
332	101	logged_in	\N	\N	66	\N	2021-03-16 10:34:16.213738+02	1	Thessaloniki
333	101	logged_in	\N	\N	66	\N	2021-03-16 10:40:50.849905+02	1	Thessaloniki
334	101	logged_in	\N	\N	66	\N	2021-03-16 10:42:19.932293+02	1	Thessaloniki
335	101	logged_in	\N	\N	66	\N	2021-03-16 10:43:25.265186+02	1	Thessaloniki
336	101	logged_in	\N	\N	66	\N	2021-03-16 10:44:15.601447+02	1	Thessaloniki
337	101	logged_in	\N	\N	66	\N	2021-03-16 10:45:54.750178+02	1	Thessaloniki
338	101	logged_in	\N	\N	66	\N	2021-03-16 10:47:00.810016+02	1	Thessaloniki
339	101	logged_in	\N	\N	66	\N	2021-03-16 10:50:19.074358+02	1	Thessaloniki
340	101	logged_in	\N	\N	66	\N	2021-03-16 10:52:15.618213+02	1	Thessaloniki
341	101	logged_in	\N	\N	66	\N	2021-03-16 10:54:11.50993+02	1	Thessaloniki
342	101	logged_in	\N	\N	66	\N	2021-03-16 10:55:56.322617+02	1	Thessaloniki
343	101	logged_in	\N	\N	66	\N	2021-03-16 10:57:45.221957+02	1	Thessaloniki
344	101	logged_in	\N	\N	66	\N	2021-03-16 11:02:48.46843+02	1	Thessaloniki
345	101	logged_in	\N	\N	66	\N	2021-03-16 11:05:57.69342+02	1	Thessaloniki
346	101	logged_in	\N	\N	66	\N	2021-03-16 12:23:03.641173+02	1	Thessaloniki
347	101	logged_in	\N	\N	66	\N	2021-03-16 12:25:00.137089+02	1	Thessaloniki
348	101	logged_in	\N	\N	66	\N	2021-03-16 12:35:17.58253+02	1	Thessaloniki
349	101	logged_in	\N	\N	66	\N	2021-03-16 17:44:09.364579+02	1	Thessaloniki
\.


--
-- Data for Name: login_platform; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_platform (id, name, url_hostname) FROM stdin;
1	#beach_bar	www.beach_bar.com
2	Google	www.google.com
3	Facebook	www.facebook.com
4	Instagram	www.instagram.com
\.


--
-- Data for Name: month_time; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.month_time (id, value, days) FROM stdin;
1	January	31
2	February	28
3	March	31
4	April	30
5	May	31
6	June	30
7	July	31
8	August	31
9	September	30
10	October	31
11	November	30
12	December	31
\.


--
-- Data for Name: offer_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offer_campaign (id, title, discount_percentage, is_active, valid_until, updated_at, "timestamp", deleted_at) FROM stdin;
2	me	35	t	2020-10-10 03:00:00+03	2020-07-21 23:22:09.340788+03	2020-07-21 23:22:09.340788+03	\N
3	me	35	t	2020-10-10 03:00:00+03	2020-07-23 17:05:43.421187+03	2020-07-23 17:05:43.421187+03	\N
\.


--
-- Data for Name: offer_campaign_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offer_campaign_code (id, campaign_id, ref_code, times_used, "timestamp", deleted_at) FROM stdin;
2	3	dhUfqlEY5HH3kpMW-CdU1SL	0	2020-07-23 17:05:49.355216+03	\N
1	2	SMsYxg7qWRY6HIWQ9CWrXQ6	2	2020-07-21 23:22:55.017224+03	\N
\.


--
-- Data for Name: offer_campaign_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offer_campaign_product (campaign_id, product_id) FROM stdin;
2	64
2	99
3	98
\.


--
-- Data for Name: owner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.owner (id, user_id, updated_at, "timestamp", deleted_at) FROM stdin;
41	107	2020-06-26 00:02:38.345767+03	2020-06-26 00:02:38.345767+03	\N
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, cart_id, card_id, ref_code, status_id, stripe_id, updated_at, "timestamp", is_refunded, app_fee, transfer_amount, transfer_group_code) FROM stdin;
117	47	21	xibsaRQ4Ta2EK7-K	1	pi_1H7TTtFMzPANwdsq2dWXmaSp	2020-07-22 00:58:38.376619+03	2020-07-22 00:58:38.376619+03	f	1.33	0.00	tg_m25-bU0BI2PgGk4g
118	47	21	njbHf235RW3ubpTK	1	pi_1H7TVoFMzPANwdsqitQpUaxT	2020-07-22 01:00:36.970037+03	2020-07-22 01:00:36.970037+03	f	0.00	1.00	tg_ykUMcRcvbBRE3XxC
119	47	21	G_Eq1rPYUotKU3Fp	1	pi_1H7TZAFMzPANwdsq7ChlfhUQ	2020-07-22 01:04:03.184978+03	2020-07-22 01:04:03.184978+03	f	1.33	0.00	tg_XO7nZ45PH-SODj6h
120	47	21	4P2MpZJgPQjbWtsO	1	pi_1H7TaMFMzPANwdsqfFVTlfVS	2020-07-22 01:05:16.832234+03	2020-07-22 01:05:16.832234+03	f	1.33	0.00	tg_C5d0l_LUP9bciNnL
121	47	21	Ns-lfrfLqq2HvDOM	1	pi_1H7ThdFMzPANwdsq0hmfQj3c	2020-07-22 01:12:49.083893+03	2020-07-22 01:12:49.083893+03	f	1.33	0.00	tg_dBF0Xc8cj7BjW9yB
122	47	21	6YJOvzdZaeiPCndw	1	pi_1H7TiwFMzPANwdsqUJqbXW0K	2020-07-22 01:14:08.746168+03	2020-07-22 01:14:08.746168+03	f	1.33	0.00	tg_pBnxwQiJOShYQdrV
123	47	21	VzUz2I2NC7IB_T6U	1	pi_1H7TnwFMzPANwdsqx0c0pJ4Z	2020-07-22 01:19:19.34279+03	2020-07-22 01:19:19.34279+03	f	1.33	0.00	tg_mxsazYXrqM1NK6lk
124	47	21	9kwpbLUsADczPwpH	1	pi_1H7TpkFMzPANwdsqO1pd3gZW	2020-07-22 01:21:11.550888+03	2020-07-22 01:21:11.550888+03	f	1.33	0.00	tg_FWDeu1CLSKVu0DQf
125	47	21	0CI-mOrIaGWpP3Jt	1	pi_1H7TqIFMzPANwdsqqxbRjlHm	2020-07-22 01:21:45.126511+03	2020-07-22 01:21:45.126511+03	f	1.33	0.00	tg_hsKFbsvDCuvaoqkJ
126	47	21	Lf9atv7eYq_nGSDz	1	pi_1H7TtgFMzPANwdsqZ3QHXjAZ	2020-07-22 01:25:15.259376+03	2020-07-22 01:25:15.259376+03	f	1.33	0.89	tg_74wxOh-G1eTR7-xO
127	47	21	wb3v96_c2JlGgwlE	1	pi_1H7TvRFMzPANwdsqoMMnL6eu	2020-07-22 01:27:04.154706+03	2020-07-22 01:27:04.154706+03	f	1.33	0.69	tg_ZPXFakDpbuZkx2Nv
128	47	21	8LjTu1SS2yfKlX9Y	1	pi_1H7TwKFMzPANwdsqqL0ZHxNd	2020-07-22 01:27:59.850323+03	2020-07-22 01:27:59.850323+03	f	1.33	0.79	tg_vYPWkHjpbr1ZihkJ
129	47	21	xX02y@IfEtro#ur-	1	pi_1HFSatFMzPANwdsqjALc4Nes	2020-08-13 01:38:53.32636+03	2020-08-13 01:38:53.32636+03	f	3.38	5.44	tg_aNcZ/koB.k_BV/kx
130	47	21	o2F4zqsdqhdcBGD2	1	pi_1HFbYHFMzPANwdsqiU5rHIZT	2020-08-13 11:12:47.41103+03	2020-08-13 11:12:47.41103+03	f	-26.62	-61.66	tg_ura44eurAEXS-4.b
131	47	21	&QGm7cEwn0moGJbI	1	pi_1HFbbzFMzPANwdsqAeQc9S8g	2020-08-13 11:16:37.173378+03	2020-08-13 11:16:37.173378+03	f	-26.62	-61.66	tg_._EqpKcogY_2.wnn
132	47	21	gOCvWH3K_594bWsp	1	pi_1HFbfYFMzPANwdsqHtPA0mEc	2020-08-13 11:20:18.670788+03	2020-08-13 11:20:18.670788+03	f	1.94	2.22	tg_UoNlL__.rfYQvUvF
133	47	21	FfmElSvGYYA87KOD	1	pi_1HFbjhFMzPANwdsq3g2MhV0D	2020-08-13 11:24:36.148828+03	2020-08-13 11:24:36.148828+03	f	1.94	2.22	tg_FtTYvGA0dR1VQoS-
134	47	21	G8yF8BXLgz#q#rZK	1	pi_1HFblPFMzPANwdsqaup6HV4Y	2020-08-13 11:26:22.207249+03	2020-08-13 11:26:22.207249+03	f	1.94	2.22	tg_sRaVvmOfgffTvMq&
135	47	21	vXit&@DT4us9JozA	1	pi_1HFbnIFMzPANwdsqSksBcFuy	2020-08-13 11:28:19.181495+03	2020-08-13 11:28:19.181495+03	f	1.94	2.22	tg_nSbYNGi2prFzEhu5
136	47	21	.MjqiWXOj1R9X0fK	1	pi_1HFbtZFMzPANwdsqgRNT0wJK	2020-08-13 11:34:48.292417+03	2020-08-13 11:34:48.292417+03	f	1.81	2.99	tg_eCAZV_n.Q3dG19.F
137	47	21	m7Du9OjP0p96izAj	1	pi_1HFc1OFMzPANwdsqNjOnHL1q	2020-08-13 11:42:52.760965+03	2020-08-13 11:42:52.760965+03	f	1.81	2.99	tg_sS6_XmCdeCkF8KVI
138	47	21	n@@RJxJyQjTYoZJ-	1	pi_1HFlmoFMzPANwdsqCd5uETTk	2020-08-13 22:08:28.86657+03	2020-08-13 22:08:28.86657+03	f	1.81	2.99	tg_YIyKUgc7#jeIGx_v
139	47	21	uyfS60-AYKTmEAIW	1	pi_1HFlnJFMzPANwdsqQzqfs2fT	2020-08-13 22:09:00.236141+03	2020-08-13 22:09:00.236141+03	f	1.81	2.99	tg_L7H1_7fwko04UqNP
140	47	21	fF2d67ZGXA1C-1q3	1	pi_1HFlndFMzPANwdsqBOhmpZWp	2020-08-13 22:09:22.443724+03	2020-08-13 22:09:22.443724+03	f	2.37	3.19	tg_OoQ7OSXZpU17phFQ
141	47	21	LqKxP#k7EmITDgDo	1	pi_1HFlnkFMzPANwdsqt89sLMRQ	2020-08-13 22:09:27.934359+03	2020-08-13 22:09:27.934359+03	f	2.37	3.19	tg_oaWgD-59i0@LvI4o
142	47	21	iAnb_1wxbxCJBc-A	1	pi_1HFm48FMzPANwdsq3R3kOmkX	2020-08-13 22:26:24.078555+03	2020-08-13 22:26:24.078555+03	f	1.81	2.99	tg_fxhLHo7f-9iXuXVI
143	47	21	pQHDzbTrFUWGeiJj	1	pi_1HFmSIFMzPANwdsq8qY1UxgG	2020-08-13 22:51:21.153428+03	2020-08-13 22:51:21.153428+03	f	1.81	2.99	tg_rmfMn#S0M&SRkyGR
144	47	21	R9LPs#clTKns3E9a	1	pi_1HFn7fFMzPANwdsqyaSfmZKT	2020-08-13 23:34:06.873864+03	2020-08-13 23:34:06.873864+03	f	2.24	2.89	tg_xT87O1w#KbPKRyLI
110	48	21	-QN34lgJTYfRF6p8	1	pi_1H7THoFMzPANwdsqz08n6ZOV	2020-07-22 00:46:07.676399+03	2020-07-22 00:46:07.676399+03	f	2.11	0.00	tg_KYA62blp1a9yKxSe
111	48	21	MkebRR5IAJoFhfeU	1	pi_1H7TISFMzPANwdsqHplzIoxW	2020-07-22 00:46:47.250971+03	2020-07-22 00:46:47.250971+03	f	2.11	0.00	tg_QrAM3UQ1Ka1ZBmoQ
112	47	21	ys4_c_1NAOZ-5Fq7	3	pi_1H7TM0FMzPANwdsqbSnlj91Z	2021-03-14 14:52:46.732702+02	2020-07-22 00:50:27.5793+03	t	2.11	0.00	tg_WJzpMnZPnvoQvTUF
114	47	21	cGArd2su9mO8U67G	3	pi_1H7TQFFMzPANwdsqo21mrvsn	2021-03-14 14:55:49.404468+02	2020-07-22 00:54:50.870532+03	t	1.33	0.00	tg_urmfdiZ4NDkSKsl2
115	47	21	odZhis4r7AyJ_gJw	3	pi_1H7TRcFMzPANwdsqbZn0BQHd	2021-03-14 16:02:21.102846+02	2020-07-22 00:56:16.604372+03	t	1.33	0.00	tg_xofZ2LXTb6ItdDH6
116	47	21	cZlVnGrcu0wYAr4x	3	pi_1H7TSkFMzPANwdsqMMCxU7GV	2021-03-14 16:03:23.368872+02	2020-07-22 00:57:25.089044+03	t	1.33	0.00	tg_nUSVGsFIHKp59rBQ
113	47	21	tY1EScFmLnftb7PS	2	pi_1H7TONFMzPANwdsqufgEXhxS	2020-07-22 00:52:55.161043+03	2020-07-22 00:52:55.161043+03	f	1.33	0.00	tg_MMrcb0Oz_Mu8xxqz
\.


--
-- Data for Name: payment_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_status (id, status) FROM stdin;
1	CREATED
2	PAID
3	REFUNDED
\.


--
-- Data for Name: payment_voucher_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_voucher_code (id, payment_id, coupon_code_id, offer_code_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: pricing_fee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_fee (id, name, percentage_value, max_capacity_percentage, "timestamp", is_manually_controlled) FROM stdin;
1	30% Percent fee	30.00	30.00	2020-07-20 02:09:24.51949+03	f
2	25% Percent fee	25.00	45.00	2020-07-20 12:07:30.232403+03	f
4	15% Percent fee	15.00	75.00	2020-07-20 12:08:10.920882+03	f
5	10% Percent fee	12.50	90.00	2020-07-20 12:08:22.986231+03	f
3	20% Percent fee	22.50	55.00	2020-07-20 12:07:51.256412+03	f
\.


--
-- Data for Name: pricing_fee_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_fee_currency (currency_id, numeric_value, "timestamp") FROM stdin;
1	0.25	2020-07-22 00:37:45.949208+03
2	0.30	2020-07-22 00:38:31.021317+03
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, beach_bar_id, price, currency_id, is_active, updated_at, "timestamp", deleted_at, description, is_individual, category_id, max_people, img_url) FROM stdin;
105	Umbrella	2	2.00	2	t	2020-07-05 13:50:53.619321+03	2020-07-05 13:50:53.619321+03	\N	ddd	f	1	1	\N
99	Umbrella with skg	1	3.00	1	f	2020-06-25 13:23:32.538472+03	2020-06-25 13:23:32.538472+03	\N	\N	f	2	2	\N
106	Hye	3	0.50	2	t	2020-07-20 17:03:28.296506+03	2020-07-20 17:03:28.296506+03	\N	ddd	f	1	2	\N
64	Umbrella with sunbed	1	0.60	2	t	2020-06-25 01:17:15.828764+03	2020-06-25 01:17:15.828764+03	\N	\N	f	2	1	\N
98	Umbrella with georgekrax	1	7.00	1	t	2020-06-25 13:17:33.248932+03	2020-06-25 13:17:33.248932+03	\N	\N	f	2	2	https://images.unsplash.com/photo-1560611958-354f2af10559?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, name, underscored_name, description, zero_price, whitelist) FROM stdin;
2	Sunbedb with umbrella	sunbed_with_umbrella	\N	f	f
1	Chair with sunbed	chair_with_sunbed	\N	t	t
5	Sunbed	sunbed	\N	t	t
\.


--
-- Data for Name: product_category_component; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category_component (category_id, component_id) FROM stdin;
1	1
1	2
2	2
2	4
5	2
\.


--
-- Data for Name: product_component; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_component (id, title, description, icon_url) FROM stdin;
1	chair	Hye	Me
2	sunbed	Hye	Me
4	umbrella	dsfsd	Me
\.


--
-- Data for Name: product_price_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_price_history (id, product_id, owner_id, diff_amount, new_price, "timestamp") FROM stdin;
\.


--
-- Data for Name: product_reservation_limit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_reservation_limit (id, limit_number, product_id, date, start_time_id, end_time_id, updated_at, "timestamp", deleted_at) FROM stdin;
1	1	64	2020-07-17	12	12	2020-07-17 00:36:09.172767+03	2020-07-17 00:36:09.172767+03	\N
2	21	64	2020-07-17	11	11	2020-07-17 00:39:36.283311+03	2020-07-17 00:39:36.283311+03	\N
3	1	64	2020-07-19	13	13	2020-07-20 15:55:30.79531+03	2020-07-20 15:55:30.79531+03	\N
4	1	64	2020-07-19	12	12	2020-07-20 16:04:11.213654+03	2020-07-20 16:04:11.213654+03	\N
\.


--
-- Data for Name: quarter_time; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quarter_time (id, value) FROM stdin;
1	01:00:00
2	01:15:00
3	01:30:00
4	01:45:00
5	02:00:00
6	02:15:00
7	02:30:00
8	02:45:00
9	03:00:00
10	03:15:00
11	03:30:00
12	03:45:00
13	04:00:00
14	04:15:00
15	04:30:00
16	04:45:00
17	05:00:00
18	05:15:00
19	05:30:00
20	05:45:00
21	06:00:00
22	06:15:00
23	06:30:00
24	06:45:00
25	07:00:00
26	08:15:00
27	08:30:00
28	08:45:00
29	09:00:00
30	09:15:00
31	09:30:00
32	09:45:00
33	10:00:00
34	10:15:00
35	10:30:00
36	10:45:00
37	11:00:00
38	11:15:00
39	11:30:00
40	11:45:00
41	12:00:00
42	12:15:00
43	12:30:00
44	12:45:00
45	13:00:00
46	13:15:00
47	13:30:00
48	13:45:00
49	14:00:00
50	14:15:00
51	14:30:00
52	14:45:00
53	15:00:00
54	15:15:00
55	15:30:00
56	15:45:00
57	16:00:00
58	16:15:00
59	16:30:00
60	16:45:00
61	17:00:00
62	17:15:00
63	17:30:00
64	17:45:00
65	18:00:00
66	18:15:00
67	18:30:00
68	18:45:00
69	19:00:00
70	19:15:00
71	19:30:00
72	19:45:00
73	20:00:00
74	20:15:00
75	20:30:00
76	20:45:00
77	21:00:00
78	21:15:00
79	21:30:00
80	21:45:00
81	22:00:00
82	22:15:00
83	22:30:00
84	22:45:00
85	23:00:00
86	23:15:00
87	23:30:00
88	23:45:00
89	00:00:00
90	00:15:00
91	00:30:00
92	00:45:00
\.


--
-- Data for Name: refund_percentage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_percentage (id, percentage_value, days_limit, days_milliseconds) FROM stdin;
1	0	1	86400000
2	15	2	172800000
3	20	3	259200000
4	25	4	345600000
5	30	5	432000000
6	35	6	518400000
7	40	7	604800000
8	58	14	1209600000
10	93	45	3888000000
11	100	60	5184000000
9	69	30	2592000000
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region (id, name, country_id, city_id) FROM stdin;
1	Kalamaria	1	1
\.


--
-- Data for Name: reserved_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reserved_product (id, product_id, payment_id, updated_at, "timestamp", deleted_at, date, time_id, is_refunded) FROM stdin;
\.


--
-- Data for Name: restaurant_food_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_food_item (id, name, price, img_url, menu_category_id, restaurant_id, deleted_at, updated_at, "timestamp") FROM stdin;
1	Burger	6.50	\N	1	1	\N	2020-06-19 21:23:44.536312+03	2020-06-19 21:23:51.30469+03
2	Χωριάτικη	5.90	\N	2	2	\N	2020-07-01 23:05:18.102469+03	2020-07-01 22:50:45.848062+03
\.


--
-- Data for Name: restaurant_menu_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_menu_category (id, name) FROM stdin;
1	Main dishes
2	Salads
\.


--
-- Data for Name: review_answer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_answer (id, review_id, body, updated_at, "timestamp", deleted_at) FROM stdin;
\.


--
-- Data for Name: review_visit_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_visit_type (id, name) FROM stdin;
2	Weekend getaway
3	Family
4	Couple
5	Group of 8+ people
1	Daily bath
\.


--
-- Data for Name: review_vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_vote (id, review_id, user_id, type_id, updated_at, "timestamp", deleted_at) FROM stdin;
\.


--
-- Data for Name: review_vote_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_vote_type (id, value) FROM stdin;
1	upvote
2	downvote
\.


--
-- Data for Name: search_filter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_filter (id, public_id, name, description) FROM stdin;
1	653	Show only available	Get only available #beach_bars that match your search criteria
3	579	Official #beach_bar partners	\N
\.


--
-- Data for Name: search_filter_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_filter_category (id, name, description) FROM stdin;
\.


--
-- Data for Name: search_filter_section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_filter_section (filter_id, category_id) FROM stdin;
\.


--
-- Data for Name: search_input_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_input_value (id, public_id, country_id, city_id, region_id, beach_bar_id, updated_at, "timestamp", deleted_at) FROM stdin;
59	68338	\N	\N	\N	1	2021-03-19 18:48:15.455623+02	2021-03-19 17:17:43.232171+02	\N
58	38891	\N	\N	\N	2	2021-03-19 17:33:47.966662+02	2021-03-19 17:17:27.881391+02	\N
61	5_@14	66	\N	\N	\N	2021-03-19 17:33:48.025868+02	2021-03-19 17:33:48.025868+02	\N
63	@2@58	66	2	1	\N	2021-03-19 17:33:48.107629+02	2021-03-19 17:33:48.107629+02	\N
60	93857	\N	\N	\N	3	2021-03-19 18:35:38.50265+02	2021-03-19 17:17:51.669483+02	\N
64	-6#87	66	3	\N	\N	2021-03-19 18:35:38.577091+02	2021-03-19 18:35:38.577091+02	\N
\.


--
-- Data for Name: search_sort; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_sort (id, name) FROM stdin;
1	Popular
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: stripe_fee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stripe_fee (id, percentage_value, pricing_fee, is_eu, currency_id, description) FROM stdin;
1	1.40	0.25	t	1	for European cards
2	2.90	0.25	f	1	for non-European cards
\.


--
-- Data for Name: stripe_minimum_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stripe_minimum_currency (id, charge_amount, currency_id) FROM stdin;
2	0.50	1
1	0.60	2
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, hashtag_id, google_id, facebook_id, instagram_id, first_name, last_name, updated_at, "timestamp", deleted_at, token_version, instagram_username, email) FROM stdin;
108	88	\N	\N	\N	\N	\N	2021-03-07 00:45:52.030581+02	2021-03-07 00:45:52.030581+02	\N	0	\N	kgt@gmail.com
109	89	\N	\N	\N	\N	\N	2021-03-07 00:52:01.562218+02	2021-03-07 00:52:01.562218+02	\N	0	\N	effsdf@gmail.com
110	90	\N	\N	\N	\N	\N	2021-03-07 00:53:40.899704+02	2021-03-07 00:53:40.899704+02	\N	0	\N	skg20178@gmail.com
111	91	\N	\N	\N	\N	\N	2021-03-07 01:02:40.363934+02	2021-03-07 01:02:40.363934+02	\N	0	\N	edssad@gmail.com
112	92	\N	\N	\N	\N	\N	2021-03-07 01:03:15.176481+02	2021-03-07 01:03:15.176481+02	\N	0	\N	ekjkdd@gmail.com
107	84	104516983422391797298	126522499071065	17841405504413788	George	Krachtopoulos	2021-03-17 20:07:52.197938+02	2020-06-26 00:02:38.056132+03	\N	45	georgekrax	georgekraxt@gmail.com
\.


--
-- Data for Name: user_contact_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_contact_details (id, account_id, country_id, phone_number, deleted_at, updated_at, "timestamp", secondary_email) FROM stdin;
55	101	1	6974954916	\N	2020-07-09 00:02:04.810151+03	2020-07-09 00:02:04.810151+03	\N
\.


--
-- Data for Name: user_favorite_bar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_favorite_bar (id, user_id, beach_bar_id, "timestamp", deleted_at) FROM stdin;
27	107	1	2021-03-16 13:07:25.620514+02	2021-03-16 13:48:39.571175+02
1	107	1	2021-03-16 11:02:53.489335+02	2021-03-16 13:48:39.571175+02
8	107	1	2021-03-16 12:23:45.923945+02	2021-03-16 13:48:39.571175+02
9	107	1	2021-03-16 12:25:51.721119+02	2021-03-16 13:48:39.571175+02
12	107	1	2021-03-16 12:42:18.181246+02	2021-03-16 13:48:39.571175+02
13	107	1	2021-03-16 12:42:20.964772+02	2021-03-16 13:48:39.571175+02
14	107	1	2021-03-16 12:42:24.017797+02	2021-03-16 13:48:39.571175+02
15	107	1	2021-03-16 12:48:00.263499+02	2021-03-16 13:48:39.571175+02
22	107	1	2021-03-16 12:54:23.84591+02	2021-03-16 13:48:39.571175+02
24	107	1	2021-03-16 12:58:19.953265+02	2021-03-16 13:48:39.571175+02
30	107	1	2021-03-16 13:20:27.163287+02	2021-03-16 13:48:39.571175+02
31	107	1	2021-03-16 13:22:08.726515+02	2021-03-16 13:48:39.571175+02
33	107	1	2021-03-16 13:47:53.906444+02	2021-03-16 13:48:39.571175+02
26	107	3	2021-03-16 13:07:24.340964+02	2021-03-16 13:50:22.806575+02
3	107	3	2021-03-16 11:03:00.189118+02	2021-03-16 13:50:22.806575+02
4	107	3	2021-03-16 11:03:14.912074+02	2021-03-16 13:50:22.806575+02
5	107	3	2021-03-16 11:03:25.739583+02	2021-03-16 13:50:22.806575+02
6	107	3	2021-03-16 11:06:05.971834+02	2021-03-16 13:50:22.806575+02
7	107	3	2021-03-16 11:06:15.01384+02	2021-03-16 13:50:22.806575+02
17	107	3	2021-03-16 12:48:05.201119+02	2021-03-16 13:50:22.806575+02
19	107	3	2021-03-16 12:53:21.145202+02	2021-03-16 13:50:22.806575+02
20	107	3	2021-03-16 12:54:20.17362+02	2021-03-16 13:50:22.806575+02
25	107	3	2021-03-16 12:58:22.121929+02	2021-03-16 13:50:22.806575+02
35	107	1	2021-03-18 13:03:49.473989+02	\N
36	107	3	2021-03-18 13:03:50.999089+02	\N
34	107	2	2021-03-18 13:03:47.937698+02	2021-03-18 13:36:01.1471+02
28	107	2	2021-03-16 13:07:27.389907+02	2021-03-18 13:36:01.1471+02
21	107	2	2021-03-16 12:54:21.060962+02	2021-03-18 13:36:01.1471+02
2	107	2	2021-03-16 11:02:56.963058+02	2021-03-18 13:36:01.1471+02
10	107	2	2021-03-16 12:35:56.257817+02	2021-03-18 13:36:01.1471+02
11	107	2	2021-03-16 12:35:56.391897+02	2021-03-18 13:36:01.1471+02
16	107	2	2021-03-16 12:48:02.297079+02	2021-03-18 13:36:01.1471+02
18	107	2	2021-03-16 12:53:19.454045+02	2021-03-18 13:36:01.1471+02
23	107	2	2021-03-16 12:58:18.904464+02	2021-03-18 13:36:01.1471+02
29	107	2	2021-03-16 13:20:25.602966+02	2021-03-18 13:36:01.1471+02
32	107	2	2021-03-16 13:22:09.973242+02	2021-03-18 13:36:01.1471+02
37	107	2	2021-03-18 13:13:07.622888+02	2021-03-18 13:36:01.1471+02
\.


--
-- Data for Name: user_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_history (id, activity_id, object_id, user_id, ip_addr, "timestamp") FROM stdin;
11	1	461	\N	\N	2021-02-22 12:23:11.25866+02
17	1	467	\N	\N	2021-02-22 13:36:03.687803+02
18	1	468	\N	\N	2021-02-22 13:38:11.307133+02
19	1	469	\N	\N	2021-02-22 13:38:20.456814+02
20	1	470	\N	\N	2021-02-22 13:38:30.495555+02
21	1	471	\N	\N	2021-02-22 13:41:43.013683+02
34	2	1	107	\N	2021-03-16 23:19:17.684132+02
38	1	487	107	\N	2021-03-17 20:35:03.26668+02
39	1	493	107	\N	2021-03-22 09:22:01.828558+02
40	1	494	107	87.203.197.211/32	2021-03-22 09:22:04.516234+02
41	1	495	107	87.203.197.211/32	2021-03-22 09:23:39.262301+02
42	1	496	107	87.203.197.211/32	2021-03-22 09:28:36.551666+02
43	1	497	107	87.203.197.211/32	2021-03-22 09:29:04.777334+02
44	1	498	107	87.203.197.211/32	2021-03-22 09:37:08.789387+02
45	1	499	107	87.203.197.211/32	2021-03-22 09:38:41.145812+02
46	1	500	107	87.203.197.211/32	2021-03-22 09:41:04.362461+02
47	1	501	107	87.203.197.211/32	2021-03-22 09:50:36.322065+02
48	1	502	107	87.203.197.211/32	2021-03-22 09:52:09.362629+02
49	1	503	107	\N	2021-03-22 09:52:49.887769+02
50	1	504	107	87.203.197.211/32	2021-03-22 09:53:52.887349+02
51	1	505	107	87.203.197.211/32	2021-03-22 09:53:53.900573+02
52	1	506	107	87.203.197.211/32	2021-03-22 09:54:02.356375+02
53	1	507	107	87.203.197.211/32	2021-03-22 09:59:40.196832+02
54	1	508	107	87.203.197.211/32	2021-03-22 10:55:02.125562+02
55	1	509	107	87.203.197.211/32	2021-03-22 15:05:11.349997+02
56	1	510	107	87.203.197.211/32	2021-03-22 15:37:55.339308+02
57	1	511	107	87.203.197.211/32	2021-03-22 15:43:14.383889+02
58	1	512	107	87.203.197.211/32	2021-03-22 15:45:08.976029+02
59	1	513	107	87.203.197.211/32	2021-03-22 15:49:01.361904+02
60	1	514	107	87.203.197.211/32	2021-03-23 08:35:29.607909+02
61	1	515	107	87.203.197.211/32	2021-03-23 08:35:58.377932+02
\.


--
-- Data for Name: user_history_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_history_activity (id, name, "timestamp") FROM stdin;
1	search	2021-02-22 12:22:37.776531+02
2	beach_bar_query	2021-02-22 12:22:54.785091+02
\.


--
-- Data for Name: user_search; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_search (id, search_date, search_adults, search_children, user_id, input_value_id, "timestamp", updated_at, sort_id) FROM stdin;
1	\N	\N	\N	\N	3	2020-07-14 16:30:40.554382+03	2020-07-14 16:30:40.554382+03	\N
2	\N	5	\N	\N	3	2020-07-14 16:30:57.815847+03	2020-07-14 16:30:57.815847+03	\N
3	\N	5	\N	\N	3	2020-07-14 16:31:13.553722+03	2020-07-14 16:31:13.553722+03	\N
25	2020-07-15	5	2	\N	5	2020-07-14 19:00:34.361405+03	2020-07-14 19:00:34.361405+03	\N
26	2020-07-15	5	2	\N	3	2020-07-14 19:00:48.470037+03	2020-07-14 19:00:48.470037+03	\N
27	2020-07-15	5	2	\N	2	2020-07-14 19:00:54.241612+03	2020-07-14 19:00:54.241612+03	\N
28	2020-07-15	5	2	\N	3	2020-07-14 19:00:57.020031+03	2020-07-14 19:00:57.020031+03	\N
29	2020-07-15	5	2	\N	3	2020-07-14 19:01:18.226073+03	2020-07-14 19:01:18.226073+03	\N
30	2020-07-15	\N	\N	\N	3	2020-07-14 19:01:33.684686+03	2020-07-14 19:01:33.684686+03	\N
31	2020-07-15	\N	\N	\N	3	2020-07-14 19:01:53.979959+03	2020-07-14 19:01:53.979959+03	\N
32	2020-07-15	\N	\N	\N	3	2020-07-14 19:05:44.748424+03	2020-07-14 19:05:44.748424+03	\N
33	2020-07-15	\N	\N	\N	3	2020-07-14 19:06:30.847828+03	2020-07-14 19:06:30.847828+03	\N
34	2020-07-15	\N	\N	\N	3	2020-07-14 19:21:43.169792+03	2020-07-14 19:21:43.169792+03	\N
35	2020-07-15	\N	\N	\N	3	2020-07-14 19:21:50.89764+03	2020-07-14 19:21:50.89764+03	\N
67	2020-07-15	\N	\N	\N	3	2020-07-14 19:26:01.896108+03	2020-07-14 19:26:01.896108+03	\N
68	2020-07-15	\N	\N	\N	3	2020-07-14 19:26:48.097903+03	2020-07-14 19:26:48.097903+03	\N
69	2020-07-14	\N	\N	\N	3	2020-07-14 19:27:08.521743+03	2020-07-14 19:27:08.521743+03	\N
70	2020-07-14	\N	\N	\N	3	2020-07-14 19:27:26.092075+03	2020-07-14 19:27:26.092075+03	\N
71	2020-07-14	\N	\N	\N	3	2020-07-14 19:27:55.135144+03	2020-07-14 19:27:55.135144+03	\N
72	2020-07-14	\N	\N	\N	3	2020-07-14 19:27:57.661708+03	2020-07-14 19:27:57.661708+03	\N
73	2020-07-14	\N	\N	\N	3	2020-07-14 19:30:35.177584+03	2020-07-14 19:30:35.177584+03	\N
74	2020-07-14	\N	\N	\N	3	2020-07-14 19:31:17.999072+03	2020-07-14 19:31:17.999072+03	\N
75	2020-07-14	\N	\N	\N	3	2020-07-14 19:32:19.352194+03	2020-07-14 19:32:19.352194+03	\N
76	2020-07-14	\N	\N	\N	3	2020-07-14 19:32:55.084593+03	2020-07-14 19:32:55.084593+03	\N
77	2020-07-14	\N	\N	\N	3	2020-07-14 19:33:18.236061+03	2020-07-14 19:33:18.236061+03	\N
78	2020-07-14	\N	\N	\N	3	2020-07-14 19:35:26.319603+03	2020-07-14 19:35:26.319603+03	\N
79	2020-07-14	\N	\N	\N	3	2020-07-14 19:35:39.883296+03	2020-07-14 19:35:39.883296+03	\N
80	2020-07-14	\N	\N	\N	3	2020-07-14 19:36:58.181293+03	2020-07-14 19:36:58.181293+03	\N
81	2020-07-14	\N	\N	\N	3	2020-07-14 19:37:28.101798+03	2020-07-14 19:37:28.101798+03	\N
82	2020-07-14	\N	\N	\N	3	2020-07-14 19:43:01.882792+03	2020-07-14 19:43:01.882792+03	\N
83	2020-07-14	\N	\N	\N	3	2020-07-14 19:55:07.738059+03	2020-07-14 19:55:07.738059+03	\N
84	2020-07-14	\N	\N	\N	3	2020-07-14 19:58:15.447506+03	2020-07-14 19:58:15.447506+03	\N
85	2020-07-14	\N	\N	\N	3	2020-07-14 22:50:31.688114+03	2020-07-14 22:50:31.688114+03	\N
86	2020-07-14	\N	\N	\N	3	2020-07-14 22:51:54.11778+03	2020-07-14 22:51:54.11778+03	\N
87	2020-07-14	\N	\N	\N	3	2020-07-14 22:56:11.319075+03	2020-07-14 22:56:11.319075+03	\N
88	2020-07-14	\N	\N	\N	3	2020-07-14 22:56:40.785469+03	2020-07-14 22:56:40.785469+03	\N
89	2020-07-14	\N	\N	\N	3	2020-07-14 22:57:35.742714+03	2020-07-14 22:57:35.742714+03	\N
90	2020-07-14	\N	\N	\N	3	2020-07-14 22:58:02.322154+03	2020-07-14 22:58:02.322154+03	\N
91	2020-07-14	\N	\N	\N	3	2020-07-14 22:58:23.508791+03	2020-07-14 22:58:23.508791+03	\N
92	2020-07-14	\N	\N	\N	3	2020-07-14 22:59:12.911837+03	2020-07-14 22:59:12.911837+03	\N
93	2020-07-14	\N	\N	\N	3	2020-07-14 23:01:26.405474+03	2020-07-14 23:01:26.405474+03	\N
94	\N	\N	\N	\N	3	2020-07-14 23:06:34.886262+03	2020-07-14 23:06:34.886262+03	\N
95	\N	\N	\N	\N	3	2020-07-14 23:06:46.329093+03	2020-07-14 23:06:46.329093+03	\N
96	\N	\N	\N	\N	3	2020-07-14 23:07:31.872138+03	2020-07-14 23:07:31.872138+03	\N
97	2020-07-14	\N	\N	\N	3	2020-07-14 23:07:45.938454+03	2020-07-14 23:07:45.938454+03	\N
98	2020-07-14	\N	\N	\N	3	2020-07-14 23:08:01.132357+03	2020-07-14 23:08:01.132357+03	\N
99	2020-07-14	\N	\N	\N	3	2020-07-14 23:08:56.977054+03	2020-07-14 23:08:56.977054+03	\N
100	2020-07-14	\N	\N	\N	3	2020-07-14 23:10:25.193988+03	2020-07-14 23:10:25.193988+03	\N
101	2020-07-14	\N	\N	\N	3	2020-07-14 23:12:55.583987+03	2020-07-14 23:12:55.583987+03	\N
102	2020-07-14	\N	\N	\N	3	2020-07-14 23:13:09.375333+03	2020-07-14 23:13:09.375333+03	\N
103	2020-07-14	\N	\N	\N	3	2020-07-14 23:13:22.691937+03	2020-07-14 23:13:22.691937+03	\N
104	2020-07-14	\N	\N	\N	3	2020-07-14 23:14:10.06204+03	2020-07-14 23:14:10.06204+03	\N
105	2020-07-14	\N	\N	\N	3	2020-07-14 23:14:32.809319+03	2020-07-14 23:14:32.809319+03	\N
106	2020-07-14	\N	\N	\N	3	2020-07-14 23:14:51.600652+03	2020-07-14 23:14:51.600652+03	\N
107	2020-07-14	\N	\N	\N	3	2020-07-14 23:15:08.742244+03	2020-07-14 23:15:08.742244+03	\N
108	2020-07-14	\N	\N	\N	3	2020-07-14 23:18:01.982616+03	2020-07-14 23:18:01.982616+03	\N
109	2020-07-14	\N	\N	\N	3	2020-07-14 23:18:30.394197+03	2020-07-14 23:18:30.394197+03	\N
110	2020-07-14	\N	\N	\N	3	2020-07-14 23:18:44.927811+03	2020-07-14 23:18:44.927811+03	\N
111	2020-07-14	\N	\N	\N	3	2020-07-14 23:19:26.959215+03	2020-07-14 23:19:26.959215+03	\N
112	2020-07-14	\N	\N	\N	3	2020-07-14 23:19:56.658305+03	2020-07-14 23:19:56.658305+03	\N
113	2020-07-14	\N	\N	\N	3	2020-07-14 23:21:39.942239+03	2020-07-14 23:21:39.942239+03	\N
114	2020-07-14	\N	\N	\N	3	2020-07-14 23:21:59.972825+03	2020-07-14 23:21:59.972825+03	\N
115	2020-07-14	\N	\N	\N	3	2020-07-14 23:23:45.152663+03	2020-07-14 23:23:45.152663+03	\N
116	2020-07-14	\N	\N	\N	3	2020-07-14 23:24:49.882405+03	2020-07-14 23:24:49.882405+03	\N
117	2020-07-14	\N	\N	\N	3	2020-07-14 23:25:22.307381+03	2020-07-14 23:25:22.307381+03	\N
118	2020-07-14	\N	\N	\N	3	2020-07-14 23:26:46.551461+03	2020-07-14 23:26:46.551461+03	\N
119	2020-07-14	\N	\N	\N	3	2020-07-14 23:28:12.114421+03	2020-07-14 23:28:12.114421+03	\N
120	2020-07-14	\N	\N	\N	3	2020-07-14 23:28:46.3965+03	2020-07-14 23:28:46.3965+03	\N
121	2020-07-14	\N	\N	\N	3	2020-07-14 23:28:58.88339+03	2020-07-14 23:28:58.88339+03	\N
122	2020-07-14	\N	\N	\N	3	2020-07-14 23:29:31.433788+03	2020-07-14 23:29:31.433788+03	\N
123	2020-07-14	\N	\N	\N	3	2020-07-14 23:29:48.782275+03	2020-07-14 23:29:48.782275+03	\N
124	2020-07-14	\N	\N	\N	3	2020-07-14 23:34:41.127134+03	2020-07-14 23:34:41.127134+03	\N
125	2020-07-14	\N	\N	\N	3	2020-07-14 23:35:23.354339+03	2020-07-14 23:35:23.354339+03	\N
126	2020-07-14	\N	\N	\N	3	2020-07-14 23:37:10.153549+03	2020-07-14 23:37:10.153549+03	\N
127	2020-07-14	\N	\N	\N	3	2020-07-14 23:37:56.873026+03	2020-07-14 23:37:56.873026+03	\N
128	2020-07-14	\N	\N	\N	3	2020-07-14 23:38:33.178051+03	2020-07-14 23:38:33.178051+03	\N
129	2020-07-14	\N	\N	\N	3	2020-07-14 23:38:57.40011+03	2020-07-14 23:38:57.40011+03	\N
130	2020-07-14	\N	\N	\N	3	2020-07-14 23:40:47.350802+03	2020-07-14 23:40:47.350802+03	\N
131	2020-07-14	\N	\N	\N	3	2020-07-14 23:42:41.696926+03	2020-07-14 23:42:41.696926+03	\N
132	2020-07-14	\N	\N	\N	3	2020-07-14 23:43:06.52973+03	2020-07-14 23:43:06.52973+03	\N
133	2020-07-14	\N	\N	\N	3	2020-07-14 23:45:17.672272+03	2020-07-14 23:45:17.672272+03	\N
134	2020-07-14	\N	\N	\N	5	2020-07-14 23:45:50.165022+03	2020-07-14 23:45:50.165022+03	\N
135	2020-07-14	\N	\N	\N	3	2020-07-14 23:45:55.187207+03	2020-07-14 23:45:55.187207+03	\N
136	\N	\N	\N	\N	3	2020-07-14 23:46:25.259739+03	2020-07-14 23:46:25.259739+03	\N
137	2020-07-14	\N	\N	\N	3	2020-07-14 23:46:28.11008+03	2020-07-14 23:46:28.11008+03	\N
138	2020-07-14	\N	\N	\N	3	2020-07-14 23:47:01.297345+03	2020-07-14 23:47:01.297345+03	\N
139	\N	\N	\N	\N	3	2020-07-14 23:47:07.214087+03	2020-07-14 23:47:07.214087+03	\N
140	\N	\N	\N	\N	3	2020-07-14 23:47:34.387144+03	2020-07-14 23:47:34.387144+03	\N
141	\N	\N	\N	\N	3	2020-07-14 23:47:40.608136+03	2020-07-14 23:47:40.608136+03	\N
142	2020-07-14	\N	\N	\N	3	2020-07-14 23:48:10.339989+03	2020-07-14 23:48:10.339989+03	\N
143	2020-07-14	\N	\N	\N	3	2020-07-14 23:48:42.460335+03	2020-07-14 23:48:42.460335+03	\N
144	2020-07-14	\N	\N	\N	3	2020-07-14 23:50:08.255193+03	2020-07-14 23:50:08.255193+03	\N
145	2020-07-14	\N	\N	\N	3	2020-07-14 23:51:26.184326+03	2020-07-14 23:51:26.184326+03	\N
146	2020-07-14	\N	\N	\N	3	2020-07-14 23:52:06.062676+03	2020-07-14 23:52:06.062676+03	\N
147	2020-07-14	\N	\N	\N	3	2020-07-14 23:52:31.595529+03	2020-07-14 23:52:31.595529+03	\N
148	2020-07-14	\N	\N	\N	3	2020-07-14 23:55:25.265269+03	2020-07-14 23:55:25.265269+03	\N
149	2020-07-14	\N	\N	\N	3	2020-07-14 23:55:40.660252+03	2020-07-14 23:55:40.660252+03	\N
150	2020-07-14	\N	\N	\N	3	2020-07-14 23:56:15.817775+03	2020-07-14 23:56:15.817775+03	\N
151	2020-07-14	\N	\N	\N	3	2020-07-15 00:00:30.928133+03	2020-07-15 00:00:30.928133+03	\N
152	2020-07-14	\N	\N	\N	3	2020-07-15 00:04:37.247342+03	2020-07-15 00:04:37.247342+03	\N
153	2020-07-14	\N	\N	\N	3	2020-07-15 00:07:50.033351+03	2020-07-15 00:07:50.033351+03	\N
154	2020-07-14	\N	\N	\N	3	2020-07-15 00:09:57.686026+03	2020-07-15 00:09:57.686026+03	\N
155	2020-07-14	\N	\N	\N	3	2020-07-15 00:15:30.280424+03	2020-07-15 00:15:30.280424+03	\N
156	2020-07-14	\N	\N	\N	3	2020-07-15 00:15:57.43335+03	2020-07-15 00:15:57.43335+03	\N
157	2020-07-14	\N	\N	\N	3	2020-07-15 00:16:03.914118+03	2020-07-15 00:16:03.914118+03	\N
158	2020-07-14	\N	\N	\N	3	2020-07-15 00:16:29.933481+03	2020-07-15 00:16:29.933481+03	\N
159	2020-07-14	\N	\N	\N	3	2020-07-15 00:16:59.868901+03	2020-07-15 00:16:59.868901+03	\N
160	2020-07-14	\N	\N	\N	3	2020-07-15 00:17:05.288039+03	2020-07-15 00:17:05.288039+03	\N
161	2020-07-14	\N	\N	\N	3	2020-07-15 00:17:39.892772+03	2020-07-15 00:17:39.892772+03	\N
162	2020-07-14	\N	\N	\N	3	2020-07-15 00:18:24.619676+03	2020-07-15 00:18:24.619676+03	\N
163	2020-07-14	\N	\N	\N	3	2020-07-15 00:18:32.242239+03	2020-07-15 00:18:32.242239+03	\N
164	2020-07-14	\N	\N	\N	3	2020-07-15 00:18:37.57939+03	2020-07-15 00:18:37.57939+03	\N
165	2020-07-14	\N	\N	\N	3	2020-07-15 00:19:08.032702+03	2020-07-15 00:19:08.032702+03	\N
166	2020-07-14	\N	\N	\N	3	2020-07-15 00:19:13.054188+03	2020-07-15 00:19:13.054188+03	\N
167	2020-07-14	\N	\N	\N	3	2020-07-15 00:19:22.413911+03	2020-07-15 00:19:22.413911+03	\N
168	2020-07-14	\N	\N	\N	3	2020-07-15 00:19:43.38688+03	2020-07-15 00:19:43.38688+03	\N
169	2020-07-14	\N	\N	\N	3	2020-07-15 00:19:55.283314+03	2020-07-15 00:19:55.283314+03	\N
170	2020-07-14	\N	\N	\N	3	2020-07-15 00:20:18.170452+03	2020-07-15 00:20:18.170452+03	\N
171	2020-07-14	\N	\N	\N	3	2020-07-15 00:27:55.423928+03	2020-07-15 00:27:55.423928+03	\N
172	2020-07-14	\N	\N	\N	3	2020-07-15 00:28:16.56552+03	2020-07-15 00:28:16.56552+03	\N
173	2020-07-14	\N	\N	\N	3	2020-07-15 00:29:02.783822+03	2020-07-15 00:29:02.783822+03	\N
174	2020-07-14	\N	\N	\N	3	2020-07-15 00:30:07.568409+03	2020-07-15 00:30:07.568409+03	\N
175	2020-07-14	\N	\N	\N	3	2020-07-15 00:30:10.032896+03	2020-07-15 00:30:10.032896+03	\N
176	2020-07-14	\N	\N	\N	3	2020-07-15 00:30:13.081156+03	2020-07-15 00:30:13.081156+03	\N
177	2020-07-14	5	\N	\N	3	2020-07-15 00:37:15.812536+03	2020-07-15 00:37:15.812536+03	\N
178	2020-07-14	5	\N	\N	3	2020-07-15 00:37:37.861152+03	2020-07-15 00:37:37.861152+03	\N
179	2020-07-14	5	\N	\N	3	2020-07-15 00:37:53.466966+03	2020-07-15 00:37:53.466966+03	\N
180	2020-07-14	5	\N	\N	3	2020-07-15 00:38:55.558128+03	2020-07-15 00:38:55.558128+03	\N
181	2020-07-14	5	\N	\N	3	2020-07-15 00:39:33.371265+03	2020-07-15 00:39:33.371265+03	\N
182	2020-07-14	5	0	\N	3	2020-07-15 00:40:50.114949+03	2020-07-15 00:40:50.114949+03	\N
183	2020-07-14	0	5	\N	3	2020-07-15 00:41:06.087398+03	2020-07-15 00:41:06.087398+03	\N
184	2020-07-14	5	5	\N	3	2020-07-15 00:41:10.889275+03	2020-07-15 00:41:10.889275+03	\N
185	2020-07-14	5	0	\N	3	2020-07-15 00:44:34.784999+03	2020-07-15 00:44:34.784999+03	\N
186	2020-07-14	5	0	\N	3	2020-07-15 00:45:20.174054+03	2020-07-15 00:45:20.174054+03	\N
187	2020-07-14	5	0	\N	3	2020-07-15 00:48:05.360164+03	2020-07-15 00:48:05.360164+03	\N
188	2020-07-14	5	0	\N	3	2020-07-15 00:48:28.767763+03	2020-07-15 00:48:28.767763+03	\N
189	2020-07-14	5	0	\N	3	2020-07-15 00:49:56.823454+03	2020-07-15 00:49:56.823454+03	\N
190	2020-07-14	5	0	\N	3	2020-07-15 00:50:17.774766+03	2020-07-15 00:50:17.774766+03	\N
191	2020-07-14	5	0	\N	3	2020-07-15 00:51:32.080394+03	2020-07-15 00:51:32.080394+03	\N
192	2020-07-14	12	0	\N	3	2020-07-15 00:51:43.975352+03	2020-07-15 00:51:43.975352+03	\N
193	2020-07-14	12	5	\N	3	2020-07-15 00:51:55.506918+03	2020-07-15 00:51:55.506918+03	\N
194	2020-07-14	12	6	\N	3	2020-07-15 00:51:58.01809+03	2020-07-15 00:51:58.01809+03	\N
195	2020-07-14	12	7	\N	3	2020-07-15 00:52:00.703852+03	2020-07-15 00:52:00.703852+03	\N
196	2020-07-14	12	6	\N	3	2020-07-15 00:53:09.512616+03	2020-07-15 00:53:09.512616+03	\N
197	2020-07-14	12	7	\N	3	2020-07-15 00:53:12.470251+03	2020-07-15 00:53:12.470251+03	\N
198	2020-07-14	12	7	\N	3	2020-07-15 00:54:26.932156+03	2020-07-15 00:54:26.932156+03	\N
199	2020-07-14	12	6	\N	3	2020-07-15 00:54:32.6258+03	2020-07-15 00:54:32.6258+03	\N
200	2020-07-14	5	0	\N	3	2020-07-15 01:00:01.636411+03	2020-07-15 01:00:01.636411+03	\N
201	2020-07-14	5	0	\N	3	2020-07-15 01:00:10.986723+03	2020-07-15 01:00:10.986723+03	\N
202	\N	\N	\N	\N	1	2020-07-15 01:01:09.392824+03	2020-07-15 01:01:09.392824+03	\N
203	\N	\N	\N	\N	3	2020-07-15 01:01:18.949101+03	2020-07-15 01:01:18.949101+03	\N
204	2020-07-14	0	0	\N	3	2020-07-15 01:01:28.380256+03	2020-07-15 01:01:28.380256+03	\N
205	2020-07-14	0	0	\N	3	2020-07-15 01:01:40.109621+03	2020-07-15 01:01:40.109621+03	\N
206	2020-07-14	5	0	\N	3	2020-07-15 01:02:07.978595+03	2020-07-15 01:02:07.978595+03	\N
207	2020-07-14	5	0	\N	3	2020-07-15 01:02:21.88454+03	2020-07-15 01:02:21.88454+03	\N
208	2020-07-14	5	0	\N	3	2020-07-15 01:02:37.944217+03	2020-07-15 01:02:37.944217+03	\N
209	2020-07-14	0	0	\N	3	2020-07-15 01:03:06.756566+03	2020-07-15 01:03:06.756566+03	\N
210	2020-07-14	0	0	\N	3	2020-07-15 01:03:18.782242+03	2020-07-15 01:03:18.782242+03	\N
211	\N	\N	\N	\N	3	2020-07-15 01:11:29.392303+03	2020-07-15 01:11:29.392303+03	\N
212	\N	\N	\N	\N	3	2020-07-15 01:12:20.313756+03	2020-07-15 01:12:20.313756+03	\N
213	2020-07-15	0	0	\N	3	2020-07-15 01:17:49.485533+03	2020-07-15 01:17:49.485533+03	\N
214	2020-07-15	0	0	\N	3	2020-07-15 01:18:48.377569+03	2020-07-15 01:18:48.377569+03	\N
215	2020-07-15	0	0	\N	3	2020-07-15 01:19:21.981268+03	2020-07-15 01:19:21.981268+03	\N
216	2020-07-15	0	0	\N	3	2020-07-15 01:21:03.007719+03	2020-07-15 01:21:03.007719+03	\N
249	2020-07-15	0	0	\N	3	2020-07-15 16:55:11.152327+03	2020-07-15 16:55:11.152327+03	\N
250	2020-07-15	0	0	\N	3	2020-07-15 16:55:27.613738+03	2020-07-15 16:55:27.613738+03	\N
251	2020-07-15	0	0	\N	3	2020-07-15 16:55:50.254288+03	2020-07-15 16:55:50.254288+03	\N
252	2020-07-15	0	0	\N	3	2020-07-15 16:57:01.505584+03	2020-07-15 16:57:01.505584+03	\N
253	2020-07-15	0	0	\N	3	2020-07-15 16:58:24.944274+03	2020-07-15 16:58:24.944274+03	\N
254	2020-07-15	0	0	\N	3	2020-07-15 16:59:20.287109+03	2020-07-15 16:59:20.287109+03	\N
255	2020-07-15	0	0	\N	3	2020-07-15 16:59:41.446889+03	2020-07-15 16:59:41.446889+03	\N
256	2020-07-15	0	0	\N	3	2020-07-15 16:59:47.852525+03	2020-07-15 16:59:47.852525+03	\N
257	2020-07-15	0	0	\N	3	2020-07-15 17:00:42.796394+03	2020-07-15 17:00:42.796394+03	\N
258	2020-07-15	0	0	\N	3	2020-07-15 17:03:00.852609+03	2020-07-15 17:03:00.852609+03	\N
259	2020-07-15	0	0	\N	3	2020-07-15 17:03:38.169853+03	2020-07-15 17:03:38.169853+03	\N
260	2020-07-15	0	0	\N	3	2020-07-15 17:04:00.88508+03	2020-07-15 17:04:00.88508+03	\N
261	2020-07-15	0	0	\N	3	2020-07-15 17:04:17.27127+03	2020-07-15 17:04:17.27127+03	\N
262	2020-07-15	0	0	\N	3	2020-07-15 17:04:45.682956+03	2020-07-15 17:04:45.682956+03	\N
263	2020-07-15	0	0	\N	3	2020-07-15 17:05:06.696247+03	2020-07-15 17:05:06.696247+03	\N
264	2020-07-15	0	0	\N	3	2020-07-15 17:05:32.6053+03	2020-07-15 17:05:32.6053+03	\N
265	2020-07-15	0	0	\N	3	2020-07-15 17:13:04.864132+03	2020-07-15 17:13:04.864132+03	\N
266	2020-07-15	0	0	\N	3	2020-07-15 17:16:40.031867+03	2020-07-15 17:16:40.031867+03	\N
267	2020-07-15	0	0	\N	3	2020-07-15 17:20:05.922919+03	2020-07-15 17:20:05.922919+03	\N
268	2020-07-15	0	0	\N	3	2020-07-15 17:20:35.150006+03	2020-07-15 17:20:35.150006+03	\N
269	2020-07-15	0	0	\N	3	2020-07-15 17:20:53.904991+03	2020-07-15 17:20:53.904991+03	\N
270	2020-07-15	0	0	\N	3	2020-07-15 17:21:11.828382+03	2020-07-15 17:21:11.828382+03	\N
271	2020-07-15	0	0	\N	3	2020-07-15 17:22:11.041633+03	2020-07-15 17:22:11.041633+03	\N
272	2020-07-15	0	0	\N	3	2020-07-15 17:22:40.863326+03	2020-07-15 17:22:40.863326+03	\N
273	2020-07-15	0	0	\N	3	2020-07-15 17:25:01.624194+03	2020-07-15 17:25:01.624194+03	\N
274	2020-07-15	0	0	\N	5	2020-07-15 17:25:13.325409+03	2020-07-15 17:25:13.325409+03	\N
275	2020-07-15	0	0	\N	5	2020-07-15 17:25:19.729203+03	2020-07-15 17:25:19.729203+03	\N
276	2020-07-15	0	0	\N	5	2020-07-15 17:25:47.315044+03	2020-07-15 17:25:47.315044+03	\N
277	2020-07-15	0	0	\N	3	2020-07-15 17:25:51.877625+03	2020-07-15 17:25:51.877625+03	\N
278	2020-07-15	0	0	\N	3	2020-07-15 17:26:40.072913+03	2020-07-15 17:26:40.072913+03	\N
279	2020-07-15	0	0	\N	3	2020-07-15 17:27:18.517657+03	2020-07-15 17:27:18.517657+03	\N
280	2020-07-15	0	0	\N	3	2020-07-15 17:32:18.331251+03	2020-07-15 17:32:18.331251+03	\N
281	2020-07-15	0	0	\N	3	2020-07-15 17:32:39.811651+03	2020-07-15 17:32:39.811651+03	\N
282	2020-07-15	0	0	\N	3	2020-07-15 17:34:06.993743+03	2020-07-15 17:34:06.993743+03	\N
283	2020-07-15	0	0	\N	3	2020-07-15 17:34:57.439086+03	2020-07-15 17:34:57.439086+03	\N
284	2020-07-15	0	0	\N	3	2020-07-15 17:35:11.223405+03	2020-07-15 17:35:11.223405+03	\N
285	2020-07-15	0	0	\N	3	2020-07-15 17:35:16.527586+03	2020-07-15 17:35:16.527586+03	\N
286	2020-07-15	0	0	\N	3	2020-07-15 17:38:14.041926+03	2020-07-15 17:38:14.041926+03	\N
287	2020-07-15	0	0	\N	3	2020-07-15 17:38:43.091112+03	2020-07-15 17:38:43.091112+03	\N
288	2020-07-15	0	0	\N	3	2020-07-15 17:49:06.962566+03	2020-07-15 17:49:06.962566+03	\N
289	2020-07-15	0	0	\N	3	2020-07-15 17:50:20.335384+03	2020-07-15 17:50:20.335384+03	\N
290	2020-07-15	0	0	\N	3	2020-07-15 17:50:32.067047+03	2020-07-15 17:50:32.067047+03	\N
291	2020-07-15	0	0	\N	3	2020-07-15 17:54:15.297979+03	2020-07-15 17:54:15.297979+03	\N
292	2020-07-15	0	0	\N	3	2020-07-15 17:54:44.085722+03	2020-07-15 17:54:44.085722+03	\N
293	2020-07-15	0	0	\N	3	2020-07-15 17:56:17.658449+03	2020-07-15 17:56:17.658449+03	\N
294	2020-07-15	0	0	\N	3	2020-07-15 17:56:38.727645+03	2020-07-15 17:56:38.727645+03	\N
295	2020-07-15	0	0	\N	3	2020-07-15 17:57:28.608519+03	2020-07-15 17:57:28.608519+03	\N
296	2020-07-15	0	0	\N	3	2020-07-15 17:57:42.189455+03	2020-07-15 17:57:42.189455+03	\N
297	2020-07-15	0	0	\N	3	2020-07-15 17:58:00.12071+03	2020-07-15 17:58:00.12071+03	\N
298	2020-07-15	0	0	\N	3	2020-07-15 17:58:20.416353+03	2020-07-15 17:58:20.416353+03	\N
299	2020-07-15	0	0	\N	3	2020-07-15 17:58:30.788843+03	2020-07-15 17:58:30.788843+03	\N
300	2020-07-15	0	0	\N	3	2020-07-15 17:59:27.055833+03	2020-07-15 17:59:27.055833+03	\N
301	2020-07-15	0	0	\N	3	2020-07-15 18:00:08.444205+03	2020-07-15 18:00:08.444205+03	\N
302	2020-07-15	0	0	\N	3	2020-07-15 18:00:16.320597+03	2020-07-15 18:00:16.320597+03	\N
303	2020-07-15	0	0	\N	3	2020-07-15 18:00:20.011071+03	2020-07-15 18:00:20.011071+03	\N
304	2020-07-16	0	0	\N	3	2020-07-16 00:00:59.11461+03	2020-07-16 00:00:59.11461+03	\N
305	2020-07-16	0	0	\N	3	2020-07-16 00:01:33.890157+03	2020-07-16 00:01:33.890157+03	\N
306	2020-07-16	0	0	\N	3	2020-07-16 00:01:47.721287+03	2020-07-16 00:01:47.721287+03	\N
307	2020-07-16	0	0	\N	3	2020-07-16 00:02:38.836778+03	2020-07-16 00:02:38.836778+03	\N
308	2020-07-16	0	0	\N	3	2020-07-16 00:03:10.949612+03	2020-07-16 00:03:10.949612+03	\N
309	2020-07-16	0	0	\N	3	2020-07-16 00:03:35.345262+03	2020-07-16 00:03:35.345262+03	\N
310	2020-07-16	0	0	\N	3	2020-07-16 00:04:49.311514+03	2020-07-16 00:04:49.311514+03	\N
311	2020-07-16	0	0	\N	3	2020-07-16 00:09:47.357505+03	2020-07-16 00:09:47.357505+03	\N
312	2020-07-15	0	0	\N	3	2020-07-16 00:13:19.859634+03	2020-07-16 00:13:19.859634+03	\N
313	2020-07-14	0	0	\N	3	2020-07-16 00:17:25.479864+03	2020-07-16 00:17:25.479864+03	\N
314	2020-07-15	0	0	\N	3	2020-07-16 00:18:05.253181+03	2020-07-16 00:18:05.253181+03	\N
315	2020-07-15	0	0	\N	3	2020-07-16 00:18:28.535636+03	2020-07-16 00:18:28.535636+03	\N
316	2020-07-15	0	0	\N	3	2020-07-16 00:21:44.100508+03	2020-07-16 00:21:44.100508+03	\N
317	2020-07-16	0	0	\N	3	2020-07-16 00:21:50.368863+03	2020-07-16 00:21:50.368863+03	\N
318	2020-07-15	0	0	\N	3	2020-07-16 00:21:54.762056+03	2020-07-16 00:21:54.762056+03	\N
319	2020-07-15	0	0	\N	3	2020-07-16 00:23:45.851796+03	2020-07-16 00:23:45.851796+03	\N
320	2020-07-14	0	0	\N	3	2020-07-16 00:26:05.899416+03	2020-07-16 00:26:05.899416+03	\N
321	2020-07-15	0	0	\N	3	2020-07-16 00:27:28.704613+03	2020-07-16 00:27:28.704613+03	\N
322	2020-07-15	0	0	\N	3	2020-07-16 00:30:18.912105+03	2020-07-16 00:30:18.912105+03	\N
323	2020-07-15	0	0	\N	3	2020-07-16 00:31:43.833111+03	2020-07-16 00:31:43.833111+03	\N
324	2020-07-15	5	0	\N	3	2020-07-16 00:43:06.196467+03	2020-07-16 00:43:06.196467+03	\N
325	2020-07-15	5	0	\N	3	2020-07-16 00:44:32.925982+03	2020-07-16 00:44:32.925982+03	\N
326	2020-07-15	5	0	\N	3	2020-07-16 00:45:28.62596+03	2020-07-16 00:45:28.62596+03	\N
327	2020-07-15	5	0	\N	3	2020-07-16 00:49:05.115183+03	2020-07-16 00:49:05.115183+03	\N
328	2020-07-15	1	0	\N	3	2020-07-16 00:49:14.534409+03	2020-07-16 00:49:14.534409+03	\N
329	2020-07-15	2	0	\N	3	2020-07-16 00:49:18.006721+03	2020-07-16 00:49:18.006721+03	\N
330	2020-07-15	2	0	\N	3	2020-07-16 00:51:15.109946+03	2020-07-16 00:51:15.109946+03	\N
331	2020-07-15	2	0	\N	3	2020-07-16 00:52:10.552994+03	2020-07-16 00:52:10.552994+03	\N
332	2020-07-15	12	8	\N	3	2020-07-16 00:52:23.800279+03	2020-07-16 00:52:23.800279+03	\N
333	2020-07-15	12	8	\N	3	2020-07-16 00:56:51.495783+03	2020-07-16 00:56:51.495783+03	\N
334	2020-07-15	12	8	\N	3	2020-07-16 00:58:33.665328+03	2020-07-16 00:58:33.665328+03	\N
335	2020-07-15	12	8	\N	3	2020-07-16 00:58:35.443855+03	2020-07-16 00:58:35.443855+03	\N
336	2020-07-15	12	8	\N	3	2020-07-16 01:02:39.348287+03	2020-07-16 01:02:39.348287+03	\N
337	2020-07-15	12	6	\N	3	2020-07-16 01:03:09.591697+03	2020-07-16 01:03:09.591697+03	\N
338	2020-07-15	12	6	\N	3	2020-07-16 01:05:13.916192+03	2020-07-16 01:05:13.916192+03	\N
339	2020-07-15	12	6	\N	3	2020-07-16 01:05:28.411547+03	2020-07-16 01:05:28.411547+03	\N
340	2020-07-15	12	6	107	3	2020-07-16 15:12:30.861943+03	2020-07-16 15:12:30.861943+03	\N
341	2020-07-15	12	6	107	3	2020-07-16 15:12:31.88091+03	2020-07-16 15:12:31.88091+03	\N
342	2020-07-15	12	6	107	3	2020-07-16 15:12:32.415868+03	2020-07-16 15:12:32.415868+03	\N
343	2020-07-15	12	6	107	3	2020-07-16 15:12:32.788827+03	2020-07-16 15:12:32.788827+03	\N
344	2020-07-15	12	6	107	3	2020-07-16 15:12:32.98796+03	2020-07-16 15:12:32.98796+03	\N
345	2020-07-15	12	6	107	3	2020-07-16 15:12:33.234209+03	2020-07-16 15:12:33.234209+03	\N
346	2020-07-15	12	6	107	5	2020-07-16 15:52:57.564513+03	2020-07-16 15:52:57.564513+03	\N
347	2020-07-15	12	6	107	1	2020-07-16 15:53:30.971261+03	2020-07-16 15:53:30.971261+03	\N
348	2020-07-15	12	6	107	2	2020-07-16 15:53:36.210914+03	2020-07-16 15:53:36.210914+03	\N
349	2020-07-15	12	6	107	3	2020-07-16 15:53:41.450776+03	2020-07-16 15:53:41.450776+03	\N
350	2020-07-15	12	6	107	4	2020-07-16 15:53:47.218986+03	2020-07-16 15:53:47.218986+03	\N
351	2020-07-15	12	6	107	5	2020-07-16 15:53:56.951569+03	2020-07-16 15:53:56.951569+03	\N
352	2020-07-15	12	6	107	18	2020-07-16 15:54:12.517913+03	2020-07-16 15:54:12.517913+03	\N
353	2020-07-15	12	6	107	18	2020-07-16 16:27:02.990323+03	2020-07-16 16:27:02.990323+03	\N
354	2020-07-15	12	6	107	3	2020-07-16 16:27:16.432176+03	2020-07-16 16:27:16.432176+03	\N
355	2020-07-16	12	6	107	3	2020-07-16 16:27:31.426452+03	2020-07-16 16:27:31.426452+03	\N
356	2020-07-15	12	6	107	3	2020-07-16 16:27:44.099026+03	2020-07-16 16:27:44.099026+03	\N
357	2020-07-16	12	6	107	3	2020-07-16 16:28:20.304925+03	2020-07-16 16:28:20.304925+03	\N
358	2020-07-16	12	6	107	3	2020-07-16 16:28:40.347846+03	2020-07-16 16:28:40.347846+03	\N
359	2020-07-16	12	6	107	3	2020-07-16 16:28:57.855145+03	2020-07-16 16:28:57.855145+03	\N
360	2020-07-16	12	6	107	3	2020-07-16 16:29:36.877045+03	2020-07-16 16:29:36.877045+03	\N
361	2020-07-16	12	6	107	3	2020-07-16 16:30:17.068775+03	2020-07-16 16:30:17.068775+03	\N
362	2020-07-16	12	6	107	3	2020-07-16 16:30:37.437298+03	2020-07-16 16:30:37.437298+03	\N
363	2020-07-16	12	6	107	3	2020-07-16 16:33:39.720524+03	2020-07-16 16:33:39.720524+03	\N
364	2020-07-16	12	6	107	3	2020-07-16 16:33:44.147706+03	2020-07-16 16:33:44.147706+03	\N
365	2020-07-16	12	6	107	3	2020-07-16 16:35:26.686257+03	2020-07-16 16:35:26.686257+03	\N
366	2020-07-16	12	6	107	3	2020-07-16 16:36:10.282967+03	2020-07-16 16:36:10.282967+03	\N
367	2020-07-16	12	6	107	3	2020-07-16 16:36:50.45941+03	2020-07-16 16:36:50.45941+03	\N
368	2020-07-16	12	6	107	3	2020-07-16 16:36:59.003268+03	2020-07-16 16:36:59.003268+03	\N
369	2020-07-16	12	6	107	3	2020-07-16 16:37:24.129256+03	2020-07-16 16:37:24.129256+03	\N
370	2020-07-16	5	0	107	3	2020-07-16 16:37:44.249446+03	2020-07-16 16:37:44.249446+03	\N
371	2020-07-16	5	0	107	3	2020-07-16 16:39:27.176929+03	2020-07-16 16:39:27.176929+03	\N
372	2020-07-16	5	0	107	3	2020-07-16 16:39:48.760655+03	2020-07-16 16:39:48.760655+03	\N
373	2020-07-16	5	0	107	19	2020-07-16 16:40:45.450277+03	2020-07-16 16:40:45.450277+03	\N
404	2020-07-16	5	0	107	19	2020-07-16 16:45:58.340506+03	2020-07-16 16:45:58.340506+03	\N
405	2020-07-16	5	0	107	19	2020-07-16 16:46:30.960335+03	2020-07-16 16:46:30.960335+03	\N
406	2020-07-16	5	0	107	19	2020-07-16 16:47:04.747084+03	2020-07-16 16:47:04.747084+03	\N
407	2020-07-16	5	0	107	19	2020-07-16 16:47:23.196049+03	2020-07-16 16:47:23.196049+03	\N
408	2020-07-16	5	0	107	19	2020-07-16 16:47:25.968951+03	2020-07-16 16:47:25.968951+03	\N
409	2020-07-16	5	0	107	19	2020-07-16 16:47:37.145388+03	2020-07-16 16:47:37.145388+03	\N
410	2020-07-16	5	0	107	19	2020-07-16 16:47:37.651921+03	2020-07-16 16:47:37.651921+03	\N
411	2020-07-16	5	0	107	4	2020-07-16 16:48:52.420286+03	2020-07-16 16:48:52.420286+03	\N
412	2020-07-16	5	0	107	19	2020-07-16 16:48:56.857527+03	2020-07-16 16:48:56.857527+03	\N
413	2020-07-16	5	0	107	3	2020-07-16 16:49:00.831162+03	2020-07-16 16:49:00.831162+03	\N
414	2020-07-16	5	0	107	3	2020-07-16 16:49:32.606291+03	2020-07-16 16:49:32.606291+03	\N
415	2020-07-16	5	0	107	3	2020-07-16 16:50:12.200514+03	2020-07-16 16:50:12.200514+03	\N
416	2020-07-16	5	0	107	19	2020-07-16 16:50:18.796748+03	2020-07-16 16:50:18.796748+03	\N
417	2020-07-16	5	0	107	19	2020-07-16 16:50:44.101563+03	2020-07-16 16:50:44.101563+03	\N
418	2020-07-16	5	0	107	3	2020-07-16 16:51:04.188684+03	2020-07-16 16:51:04.188684+03	\N
419	2020-07-16	5	0	107	3	2020-07-16 16:51:19.909881+03	2020-07-16 16:51:19.909881+03	\N
420	2020-07-16	5	0	107	19	2020-07-16 16:51:26.60023+03	2020-07-16 16:51:26.60023+03	\N
421	2020-07-16	5	0	107	19	2020-07-16 16:51:53.308439+03	2020-07-16 16:51:53.308439+03	\N
422	2020-07-16	5	0	107	3	2020-07-16 16:52:01.874557+03	2020-07-16 16:52:01.874557+03	\N
423	2020-07-16	5	0	107	3	2020-07-16 16:59:47.057724+03	2020-07-16 16:59:47.057724+03	\N
424	2020-07-16	5	0	107	3	2020-07-16 17:06:41.795858+03	2020-07-16 17:06:41.795858+03	\N
425	2020-07-16	5	0	107	3	2020-07-16 17:08:25.703191+03	2020-07-16 17:08:25.703191+03	\N
426	2020-07-16	5	0	107	3	2020-07-16 17:09:59.627523+03	2020-07-16 17:09:59.627523+03	\N
427	2020-07-16	5	0	107	3	2020-07-16 17:21:20.417363+03	2020-07-16 17:21:20.417363+03	\N
428	2020-07-16	5	0	\N	3	2020-07-16 17:31:57.190862+03	2020-07-16 17:31:57.190862+03	\N
429	2020-07-16	5	0	\N	3	2020-07-16 17:32:37.053077+03	2020-07-16 17:32:37.053077+03	\N
430	2020-07-16	5	0	\N	3	2020-07-16 18:52:32.763006+03	2020-07-16 18:52:32.763006+03	\N
431	2020-07-17	5	0	\N	3	2020-07-17 00:03:04.568277+03	2020-07-17 00:03:04.568277+03	\N
432	\N	\N	\N	\N	3	2020-07-20 17:37:26.652426+03	2020-07-20 17:37:26.652426+03	\N
433	\N	\N	\N	\N	3	2020-07-20 17:44:12.190958+03	2020-07-20 17:44:12.190958+03	\N
434	\N	\N	\N	\N	3	2020-07-20 17:44:21.735732+03	2020-07-20 17:44:21.735732+03	\N
435	\N	\N	\N	\N	3	2020-07-20 17:44:22.706034+03	2020-07-20 17:44:22.706034+03	\N
436	\N	\N	\N	\N	3	2020-07-20 17:44:28.027602+03	2020-07-20 17:44:28.027602+03	\N
437	\N	\N	\N	\N	3	2020-07-20 17:50:03.336761+03	2020-07-20 17:50:03.336761+03	\N
438	\N	\N	\N	107	3	2020-07-22 23:44:45.872994+03	2020-07-22 23:44:45.872994+03	\N
439	\N	\N	\N	107	3	2020-07-22 23:44:55.029445+03	2020-07-22 23:44:55.029445+03	\N
440	\N	\N	\N	107	4	2020-07-22 23:45:12.172126+03	2020-07-22 23:45:12.172126+03	\N
441	\N	\N	\N	\N	4	2020-07-24 02:15:55.751907+03	2020-07-24 02:15:55.751907+03	\N
442	\N	\N	\N	\N	4	2020-07-24 18:04:24.136122+03	2020-07-24 18:04:24.136122+03	\N
443	\N	\N	\N	\N	4	2020-07-24 18:04:29.532531+03	2020-07-24 18:04:29.532531+03	\N
444	\N	\N	\N	\N	4	2020-07-24 18:09:32.796179+03	2020-07-24 18:09:32.796179+03	\N
445	\N	\N	\N	\N	4	2020-07-24 18:10:42.652768+03	2020-07-24 18:10:42.652768+03	\N
446	\N	\N	\N	\N	4	2020-07-24 18:12:09.205146+03	2020-07-24 18:12:09.205146+03	\N
447	\N	\N	\N	107	4	2020-07-25 00:58:45.940754+03	2020-07-25 00:58:45.940754+03	\N
448	\N	\N	\N	107	4	2020-07-25 01:04:03.239495+03	2020-07-25 01:04:03.239495+03	\N
449	\N	\N	\N	107	4	2020-07-25 01:06:30.409998+03	2020-07-25 01:06:30.409998+03	\N
450	\N	\N	\N	\N	4	2020-07-25 17:47:32.299778+03	2020-07-25 17:47:32.299778+03	\N
451	\N	\N	\N	\N	3	2021-02-22 11:43:17.283044+02	2021-02-22 11:43:17.283044+02	\N
452	\N	\N	\N	\N	3	2021-02-22 11:45:28.28164+02	2021-02-22 11:45:28.28164+02	\N
453	\N	\N	\N	\N	3	2021-02-22 11:46:13.461443+02	2021-02-22 11:46:13.461443+02	\N
454	\N	\N	\N	\N	3	2021-02-22 12:13:04.148465+02	2021-02-22 12:13:04.148465+02	\N
455	\N	\N	\N	\N	3	2021-02-22 12:14:35.832827+02	2021-02-22 12:14:35.832827+02	\N
456	\N	\N	\N	\N	3	2021-02-22 12:15:28.376328+02	2021-02-22 12:15:28.376328+02	\N
457	\N	\N	\N	\N	3	2021-02-22 12:16:18.342201+02	2021-02-22 12:16:18.342201+02	\N
458	\N	\N	\N	\N	3	2021-02-22 12:17:00.758244+02	2021-02-22 12:17:00.758244+02	\N
459	\N	\N	\N	\N	3	2021-02-22 12:17:50.746338+02	2021-02-22 12:17:50.746338+02	\N
460	\N	\N	\N	\N	3	2021-02-22 12:21:22.538047+02	2021-02-22 12:21:22.538047+02	\N
461	\N	\N	\N	\N	3	2021-02-22 12:23:10.964841+02	2021-02-22 12:23:10.964841+02	\N
462	\N	\N	\N	107	3	2021-02-22 12:26:41.969832+02	2021-02-22 12:26:41.969832+02	\N
463	\N	\N	\N	107	3	2021-02-22 12:28:06.316415+02	2021-02-22 12:28:06.316415+02	\N
464	\N	\N	\N	107	3	2021-02-22 12:29:00.401375+02	2021-02-22 12:29:00.401375+02	\N
465	\N	\N	\N	107	4	2021-02-22 12:38:21.174691+02	2021-02-22 12:38:21.174691+02	\N
466	\N	2	\N	107	4	2021-02-22 12:48:12.372938+02	2021-02-22 12:48:12.372938+02	\N
467	\N	2	\N	\N	6	2021-02-22 13:36:03.23491+02	2021-02-22 13:36:03.23491+02	\N
468	\N	2	\N	\N	18	2021-02-22 13:38:11.01715+02	2021-02-22 13:38:11.01715+02	\N
469	\N	2	\N	\N	4	2021-02-22 13:38:20.17921+02	2021-02-22 13:38:20.17921+02	\N
470	\N	2	\N	\N	5	2021-02-22 13:38:30.218898+02	2021-02-22 13:38:30.218898+02	\N
471	\N	2	\N	\N	5	2021-02-22 13:41:42.711361+02	2021-02-22 13:41:42.711361+02	\N
484	2021-04-02	2	\N	107	5	2021-03-17 10:41:39.553125+02	2021-03-17 10:41:39.553125+02	\N
485	2021-04-02	0	\N	107	5	2021-03-17 11:13:19.079742+02	2021-03-17 11:13:19.079742+02	\N
486	2021-04-03	0	\N	107	5	2021-03-17 11:13:32.411795+02	2021-03-17 11:13:32.411795+02	\N
487	2021-04-03	0	\N	107	5	2021-03-17 20:35:03.167055+02	2021-03-17 20:35:03.167055+02	\N
493	\N	\N	\N	107	64	2021-03-22 09:22:01.745242+02	2021-03-22 09:22:01.745242+02	\N
494	\N	\N	\N	107	64	2021-03-22 09:22:04.500108+02	2021-03-22 09:22:04.500108+02	\N
495	\N	\N	\N	107	64	2021-03-22 09:23:39.206984+02	2021-03-22 09:23:39.206984+02	\N
496	\N	\N	\N	107	64	2021-03-22 09:28:36.531448+02	2021-03-22 09:28:36.531448+02	\N
497	\N	\N	\N	107	64	2021-03-22 09:29:04.763218+02	2021-03-22 09:29:04.763218+02	\N
498	\N	\N	\N	107	63	2021-03-22 09:37:08.754186+02	2021-03-22 09:37:08.754186+02	\N
499	\N	\N	\N	107	64	2021-03-22 09:38:41.13049+02	2021-03-22 09:38:41.13049+02	\N
500	2021-03-22	1	0	107	64	2021-03-22 09:41:04.308847+02	2021-03-22 09:41:04.308847+02	\N
501	2021-03-22	1	0	107	64	2021-03-22 09:50:36.251394+02	2021-03-22 09:50:36.251394+02	\N
502	2021-03-22	1	0	107	63	2021-03-22 09:52:09.30759+02	2021-03-22 09:52:09.30759+02	\N
503	\N	\N	\N	107	64	2021-03-22 09:52:49.872955+02	2021-03-22 09:52:49.872955+02	\N
504	2021-03-22	1	0	107	59	2021-03-22 09:53:52.830663+02	2021-03-22 09:53:52.830663+02	\N
505	2021-03-22	1	0	107	59	2021-03-22 09:53:53.882237+02	2021-03-22 09:53:53.882237+02	\N
506	2021-03-22	1	0	107	64	2021-03-22 09:54:02.344857+02	2021-03-22 09:54:02.344857+02	\N
507	2021-03-22	1	0	107	64	2021-03-22 09:59:40.123777+02	2021-03-22 09:59:40.123777+02	\N
508	2021-03-22	1	0	107	64	2021-03-22 10:55:02.022198+02	2021-03-22 10:55:02.022198+02	\N
509	2021-03-22	1	0	107	64	2021-03-22 15:05:11.219227+02	2021-03-22 15:05:11.219227+02	\N
510	2021-03-22	1	0	107	64	2021-03-22 15:37:55.28936+02	2021-03-22 15:37:55.28936+02	\N
511	2021-03-22	1	0	107	64	2021-03-22 15:43:14.317681+02	2021-03-22 15:43:14.317681+02	\N
512	2021-03-22	1	0	107	64	2021-03-22 15:45:08.905397+02	2021-03-22 15:45:08.905397+02	\N
513	2021-03-22	1	0	107	64	2021-03-22 15:49:01.339288+02	2021-03-22 15:49:01.339288+02	\N
514	2021-03-23	1	0	107	64	2021-03-23 08:35:29.495107+02	2021-03-23 08:35:29.495107+02	\N
515	2021-03-23	1	0	107	64	2021-03-23 08:35:58.302013+02	2021-03-23 08:35:58.302013+02	\N
\.


--
-- Data for Name: user_search_filter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_search_filter (search_id, filter_id) FROM stdin;
441	1
441	3
441	1
441	3
441	1
441	3
\.


--
-- Data for Name: vote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vote (id, feedback_id, user_id, rating, "timestamp") FROM stdin;
\.


--
-- Data for Name: voting_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voting_feedback (id, title, description, ref_code, "timestamp", deleted_at) FROM stdin;
1	PayPal Payment Intergration	Would you like to pay with PayPal insted of a credit or debit card here on #beach_bar?	0175	2020-06-21 21:48:18.458875+03	\N
\.


--
-- Data for Name: voting_result; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voting_result (id, feedback_id, upvotes, downvotes, total_votes) FROM stdin;
\.


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_id_seq', 101, true);


--
-- Name: account_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_user_id_seq', 1, false);


--
-- Name: aws_s3_bucket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.aws_s3_bucket_id_seq', 2, false);


--
-- Name: beach_bar_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_category_id_seq', 2, true);


--
-- Name: beach_bar_entry_fee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_entry_fee_id_seq', 39, true);


--
-- Name: beach_bar_feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_feature_id_seq', 5, true);


--
-- Name: beach_bar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_id_seq', 5, true);


--
-- Name: beach_bar_img_url_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_img_url_id_seq', 5, true);


--
-- Name: beach_bar_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_location_id_seq', 13, true);


--
-- Name: beach_bar_owner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_owner_id_seq', 9, true);


--
-- Name: beach_bar_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_restaurant_id_seq', 12, true);


--
-- Name: beach_bar_review_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_review_customer_id_seq', 1, false);


--
-- Name: beach_bar_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_review_id_seq', 19, true);


--
-- Name: beach_bar_review_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_review_payment_id_seq', 1, true);


--
-- Name: beach_bar_style_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beach_bar_style_id_seq', 7, true);


--
-- Name: card_brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.card_brand_id_seq', 3, true);


--
-- Name: card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.card_id_seq', 87, true);


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 245, true);


--
-- Name: city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.city_id_seq', 3, true);


--
-- Name: client_browser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_browser_id_seq', 1, true);


--
-- Name: client_os_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_os_id_seq', 1, true);


--
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.country_id_seq', 76, false);


--
-- Name: coupon_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupon_code_id_seq', 1, true);


--
-- Name: currency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currency_id_seq', 153, true);


--
-- Name: currency_product_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.currency_product_price_id_seq', 2, true);


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 67, true);


--
-- Name: hour_time_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hour_time_id_seq', 24, true);


--
-- Name: login_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_details_id_seq', 349, true);


--
-- Name: login_platform_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_platform_id_seq', 4, true);


--
-- Name: month_time_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.month_time_id_seq', 12, true);


--
-- Name: offer_campaign_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offer_campaign_code_id_seq', 2, true);


--
-- Name: offer_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offer_campaign_id_seq', 3, true);


--
-- Name: owner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.owner_id_seq', 42, true);


--
-- Name: payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_id_seq', 144, true);


--
-- Name: payment_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_status_id_seq', 3, true);


--
-- Name: payment_voucher_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_voucher_code_id_seq', 1, false);


--
-- Name: pricing_fee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pricing_fee_id_seq', 5, true);


--
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 5, true);


--
-- Name: product_component_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_component_id_seq', 4, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 106, true);


--
-- Name: product_price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_price_history_id_seq', 43, true);


--
-- Name: product_reservation_limit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_reservation_limit_id_seq', 4, true);


--
-- Name: quarter_time_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quarter_time_id_seq', 92, true);


--
-- Name: refund_percentage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refund_percentage_id_seq', 11, true);


--
-- Name: region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.region_id_seq', 1, true);


--
-- Name: reserved_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reserved_products_id_seq', 128, true);


--
-- Name: restaurant_food_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_food_item_id_seq', 4, true);


--
-- Name: restaurant_menu_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_menu_category_id_seq', 2, true);


--
-- Name: review_answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_answer_id_seq', 1, true);


--
-- Name: review_visit_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_visit_type_id_seq', 5, true);


--
-- Name: review_vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_vote_id_seq', 55, true);


--
-- Name: review_vote_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_vote_type_id_seq', 1, false);


--
-- Name: search_filter_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_filter_category_id_seq', 1, false);


--
-- Name: search_filter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_filter_id_seq', 3, true);


--
-- Name: search_input_value_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_input_value_id_seq', 69, true);


--
-- Name: search_sort_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_sort_type_id_seq', 1, false);


--
-- Name: stripe_fee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stripe_fee_id_seq', 2, true);


--
-- Name: stripe_minimum_currency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stripe_minimum_currency_id_seq', 2, true);


--
-- Name: user_contact_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_contact_details_id_seq', 55, true);


--
-- Name: user_favorite_bar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_favorite_bar_id_seq', 37, true);


--
-- Name: user_history_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_history_activity_id_seq', 1, false);


--
-- Name: user_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_history_id_seq', 61, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 107, true);


--
-- Name: user_search_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_search_id_seq', 515, true);


--
-- Name: vote_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vote_category_id_seq', 1, true);


--
-- Name: vote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vote_id_seq', 1, false);


--
-- Name: vote_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vote_tag_id_seq', 10, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account account_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_key UNIQUE (user_id);


--
-- Name: aws_s3_bucket aws_s3_bucket_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aws_s3_bucket
    ADD CONSTRAINT aws_s3_bucket_name_key UNIQUE (name);


--
-- Name: aws_s3_bucket aws_s3_bucket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aws_s3_bucket
    ADD CONSTRAINT aws_s3_bucket_pkey PRIMARY KEY (id);


--
-- Name: aws_s3_bucket aws_s3_bucket_table_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aws_s3_bucket
    ADD CONSTRAINT aws_s3_bucket_table_name_key UNIQUE (table_name);


--
-- Name: beach_bar_category beach_bar_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_category
    ADD CONSTRAINT beach_bar_category_name_key UNIQUE (name);


--
-- Name: beach_bar_category beach_bar_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_category
    ADD CONSTRAINT beach_bar_category_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_entry_fee beach_bar_entry_fee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_entry_fee
    ADD CONSTRAINT beach_bar_entry_fee_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_service beach_bar_feature_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_service
    ADD CONSTRAINT beach_bar_feature_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_img_url beach_bar_img_url_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_img_url
    ADD CONSTRAINT beach_bar_img_url_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_location beach_bar_location_beach_bar_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_beach_bar_id_key UNIQUE (beach_bar_id);


--
-- Name: beach_bar_location beach_bar_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_pkey PRIMARY KEY (id);


--
-- Name: beach_bar beach_bar_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_name_key UNIQUE (name);


--
-- Name: beach_bar_owner beach_bar_owner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_owner
    ADD CONSTRAINT beach_bar_owner_pkey PRIMARY KEY (id);


--
-- Name: beach_bar beach_bar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_restaurant beach_bar_restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_restaurant
    ADD CONSTRAINT beach_bar_restaurant_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_review beach_bar_review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_pkey PRIMARY KEY (id);


--
-- Name: beach_bar beach_bar_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_slug_key UNIQUE (slug);


--
-- Name: beach_bar_style beach_bar_style_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_style
    ADD CONSTRAINT beach_bar_style_name_key UNIQUE (name);


--
-- Name: beach_bar_style beach_bar_style_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_style
    ADD CONSTRAINT beach_bar_style_pkey PRIMARY KEY (id);


--
-- Name: card_brand card_brand_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_brand
    ADD CONSTRAINT card_brand_name_key UNIQUE (name);


--
-- Name: card_brand card_brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_brand
    ADD CONSTRAINT card_brand_pkey PRIMARY KEY (id);


--
-- Name: card card_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: city city_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_name_key UNIQUE (name);


--
-- Name: city city_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (id);


--
-- Name: client_browser client_browser_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_browser
    ADD CONSTRAINT client_browser_name_key UNIQUE (name);


--
-- Name: client_browser client_browser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_browser
    ADD CONSTRAINT client_browser_pkey PRIMARY KEY (id);


--
-- Name: client_os client_os_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_os
    ADD CONSTRAINT client_os_name_key UNIQUE (name);


--
-- Name: client_os client_os_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client_os
    ADD CONSTRAINT client_os_pkey PRIMARY KEY (id);


--
-- Name: country country_alpha_2_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_alpha_2_code_key UNIQUE (alpha_2_code);


--
-- Name: country country_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_name_key UNIQUE (name);


--
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- Name: country country_two_letter_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_two_letter_code_key UNIQUE (alpha_3_code);


--
-- Name: coupon_code coupon_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_code
    ADD CONSTRAINT coupon_code_pkey PRIMARY KEY (id);


--
-- Name: coupon_code coupon_code_ref_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_code
    ADD CONSTRAINT coupon_code_ref_code_key UNIQUE (ref_code);


--
-- Name: currency currency_iso_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_iso_code_key UNIQUE (iso_code);


--
-- Name: currency currency_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_name_key UNIQUE (name);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (id);


--
-- Name: currency_product_price currency_product_price_currency_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_product_price
    ADD CONSTRAINT currency_product_price_currency_id_key UNIQUE (currency_id);


--
-- Name: currency_product_price currency_product_price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_product_price
    ADD CONSTRAINT currency_product_price_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: hour_time hour_time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hour_time
    ADD CONSTRAINT hour_time_pkey PRIMARY KEY (id);


--
-- Name: hour_time hour_time_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hour_time
    ADD CONSTRAINT hour_time_value_key UNIQUE (value);


--
-- Name: login_details login_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_pkey PRIMARY KEY (id);


--
-- Name: login_platform login_platform_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_platform
    ADD CONSTRAINT login_platform_name_key UNIQUE (name);


--
-- Name: login_platform login_platform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_platform
    ADD CONSTRAINT login_platform_pkey PRIMARY KEY (id);


--
-- Name: login_platform login_platform_url_hostname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_platform
    ADD CONSTRAINT login_platform_url_hostname_key UNIQUE (url_hostname);


--
-- Name: month_time month_time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.month_time
    ADD CONSTRAINT month_time_pkey PRIMARY KEY (id);


--
-- Name: month_time month_time_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.month_time
    ADD CONSTRAINT month_time_value_key UNIQUE (value);


--
-- Name: offer_campaign_code offer_campaign_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign_code
    ADD CONSTRAINT offer_campaign_code_pkey PRIMARY KEY (id);


--
-- Name: offer_campaign offer_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign
    ADD CONSTRAINT offer_campaign_pkey PRIMARY KEY (id);


--
-- Name: offer_campaign_product offer_campaign_product_campaign_product_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign_product
    ADD CONSTRAINT offer_campaign_product_campaign_product_key UNIQUE (campaign_id, product_id);


--
-- Name: owner owner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT owner_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment payment_ref_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_ref_code_key UNIQUE (ref_code);


--
-- Name: payment_status payment_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_status
    ADD CONSTRAINT payment_status_pkey PRIMARY KEY (id);


--
-- Name: payment_status payment_status_status_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_status
    ADD CONSTRAINT payment_status_status_key UNIQUE (status);


--
-- Name: payment payment_transfer_group_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_transfer_group_code_key UNIQUE (transfer_group_code);


--
-- Name: payment_voucher_code payment_voucher_code_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code
    ADD CONSTRAINT payment_voucher_code_payment_id_key UNIQUE (payment_id);


--
-- Name: payment_voucher_code payment_voucher_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code
    ADD CONSTRAINT payment_voucher_code_pkey PRIMARY KEY (id);


--
-- Name: pricing_fee_currency pricing_fee_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee_currency
    ADD CONSTRAINT pricing_fee_currency_pkey PRIMARY KEY (currency_id);


--
-- Name: pricing_fee pricing_fee_min_capacity_percentage_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee
    ADD CONSTRAINT pricing_fee_min_capacity_percentage_key UNIQUE (max_capacity_percentage);


--
-- Name: pricing_fee pricing_fee_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee
    ADD CONSTRAINT pricing_fee_name_key UNIQUE (name);


--
-- Name: pricing_fee pricing_fee_percentage_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee
    ADD CONSTRAINT pricing_fee_percentage_value_key UNIQUE (percentage_value);


--
-- Name: pricing_fee pricing_fee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee
    ADD CONSTRAINT pricing_fee_pkey PRIMARY KEY (id);


--
-- Name: product_category_component product_category_component_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_component
    ADD CONSTRAINT product_category_component_pkey PRIMARY KEY (category_id, component_id);


--
-- Name: product_category product_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_name_key UNIQUE (name);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_underscored_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_underscored_name_key UNIQUE (underscored_name);


--
-- Name: product_component product_component_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_component
    ADD CONSTRAINT product_component_pkey PRIMARY KEY (id);


--
-- Name: product_component product_component_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_component
    ADD CONSTRAINT product_component_title_key UNIQUE (title);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_price_history product_price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history
    ADD CONSTRAINT product_price_history_pkey PRIMARY KEY (id);


--
-- Name: product_reservation_limit product_reservation_limit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reservation_limit
    ADD CONSTRAINT product_reservation_limit_pkey PRIMARY KEY (id);


--
-- Name: quarter_time quarter_time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarter_time
    ADD CONSTRAINT quarter_time_pkey PRIMARY KEY (id);


--
-- Name: quarter_time quarter_time_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarter_time
    ADD CONSTRAINT quarter_time_value_key UNIQUE (value);


--
-- Name: refund_percentage refund_percentage_days_limit_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_percentage
    ADD CONSTRAINT refund_percentage_days_limit_key UNIQUE (days_limit);


--
-- Name: refund_percentage refund_percentage_days_milliseconds_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_percentage
    ADD CONSTRAINT refund_percentage_days_milliseconds_key UNIQUE (days_milliseconds);


--
-- Name: refund_percentage refund_percentage_percentage_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_percentage
    ADD CONSTRAINT refund_percentage_percentage_value_key UNIQUE (percentage_value);


--
-- Name: refund_percentage refund_percentage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_percentage
    ADD CONSTRAINT refund_percentage_pkey PRIMARY KEY (id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reserved_product reserved_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserved_product
    ADD CONSTRAINT reserved_products_pkey PRIMARY KEY (id);


--
-- Name: restaurant_food_item restaurant_food_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_food_item
    ADD CONSTRAINT restaurant_food_item_pkey PRIMARY KEY (id);


--
-- Name: restaurant_menu_category restaurant_menu_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_menu_category
    ADD CONSTRAINT restaurant_menu_category_pkey PRIMARY KEY (id);


--
-- Name: review_answer review_answer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_answer
    ADD CONSTRAINT review_answer_pkey PRIMARY KEY (id);


--
-- Name: review_visit_type review_visit_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_visit_type
    ADD CONSTRAINT review_visit_type_pkey PRIMARY KEY (id);


--
-- Name: review_vote review_vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote
    ADD CONSTRAINT review_vote_pkey PRIMARY KEY (id);


--
-- Name: review_vote_type review_vote_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote_type
    ADD CONSTRAINT review_vote_type_pkey PRIMARY KEY (id);


--
-- Name: review_vote_type review_vote_type_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote_type
    ADD CONSTRAINT review_vote_type_type_key UNIQUE (value);


--
-- Name: search_filter_category search_filter_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter_category
    ADD CONSTRAINT search_filter_category_name_key UNIQUE (name);


--
-- Name: search_filter_category search_filter_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter_category
    ADD CONSTRAINT search_filter_category_pkey PRIMARY KEY (id);


--
-- Name: search_filter search_filter_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter
    ADD CONSTRAINT search_filter_name_key UNIQUE (name);


--
-- Name: search_filter search_filter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter
    ADD CONSTRAINT search_filter_pkey PRIMARY KEY (id);


--
-- Name: search_filter search_filter_public_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter
    ADD CONSTRAINT search_filter_public_id_key UNIQUE (public_id);


--
-- Name: search_input_value search_input_value_country_id_city_id_region_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_country_id_city_id_region_id_key UNIQUE (country_id, city_id, region_id);


--
-- Name: search_input_value search_input_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_pkey PRIMARY KEY (id);


--
-- Name: search_input_value search_input_value_public_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_public_id_key UNIQUE (public_id);


--
-- Name: search_sort search_sort_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_sort
    ADD CONSTRAINT search_sort_type_name_key UNIQUE (name);


--
-- Name: search_sort search_sort_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_sort
    ADD CONSTRAINT search_sort_type_pkey PRIMARY KEY (id);


--
-- Name: stripe_fee stripe_fee_description_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_fee
    ADD CONSTRAINT stripe_fee_description_key UNIQUE (description);


--
-- Name: stripe_fee stripe_fee_percentage_value_pricing_fee_currency_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_fee
    ADD CONSTRAINT stripe_fee_percentage_value_pricing_fee_currency_id_key UNIQUE (percentage_value, pricing_fee, currency_id);


--
-- Name: stripe_fee stripe_fee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_fee
    ADD CONSTRAINT stripe_fee_pkey PRIMARY KEY (id);


--
-- Name: stripe_minimum_currency stripe_minimum_currency_currency_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_minimum_currency
    ADD CONSTRAINT stripe_minimum_currency_currency_id_key UNIQUE (currency_id);


--
-- Name: stripe_minimum_currency stripe_minimum_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_minimum_currency
    ADD CONSTRAINT stripe_minimum_currency_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_service unique_feature_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_service
    ADD CONSTRAINT unique_feature_name UNIQUE (name);


--
-- Name: review_visit_type unique_review_visit_type_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_visit_type
    ADD CONSTRAINT unique_review_visit_type_name UNIQUE (name);


--
-- Name: user_contact_details user_contact_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contact_details
    ADD CONSTRAINT user_contact_details_pkey PRIMARY KEY (id);


--
-- Name: user_favorite_bar user_favorite_bar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorite_bar
    ADD CONSTRAINT user_favorite_bar_pkey PRIMARY KEY (id);


--
-- Name: user_history_activity user_history_activity_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history_activity
    ADD CONSTRAINT user_history_activity_name_key UNIQUE (name);


--
-- Name: user_history_activity user_history_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history_activity
    ADD CONSTRAINT user_history_activity_pkey PRIMARY KEY (id);


--
-- Name: user_history user_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history
    ADD CONSTRAINT user_history_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_search user_search_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search
    ADD CONSTRAINT user_search_pkey PRIMARY KEY (id);


--
-- Name: voting_feedback vote_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_feedback
    ADD CONSTRAINT vote_category_pkey PRIMARY KEY (id);


--
-- Name: voting_feedback vote_category_ref_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_feedback
    ADD CONSTRAINT vote_category_ref_code_key UNIQUE (ref_code);


--
-- Name: vote vote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_pkey PRIMARY KEY (id);


--
-- Name: voting_result vote_tag_category_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_result
    ADD CONSTRAINT vote_tag_category_id_key UNIQUE (feedback_id);


--
-- Name: voting_result vote_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_result
    ADD CONSTRAINT vote_tag_pkey PRIMARY KEY (id);


--
-- Name: beach_bar_entry_fee_beach_bar_id_date_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX beach_bar_entry_fee_beach_bar_id_date_key ON public.beach_bar_entry_fee USING btree (beach_bar_id, date) WHERE (deleted_at IS NULL);


--
-- Name: beach_bar_owner_beach_bar_id_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX beach_bar_owner_beach_bar_id_user_id_key ON public.beach_bar_owner USING btree (beach_bar_id, owner_id) WHERE (deleted_at IS NULL);


--
-- Name: beach_bar_restaurant_beach_bar_id_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX beach_bar_restaurant_beach_bar_id_name_key ON public.beach_bar_restaurant USING btree (beach_bar_id, name) WHERE (deleted_at IS NULL);


--
-- Name: beach_bar_stripe_connect_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX beach_bar_stripe_connect_id_key ON public.beach_bar USING btree (stripe_connect_id) WHERE (deleted_at IS NULL);


--
-- Name: bundle_product_component_product_id_component_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX bundle_product_component_product_id_component_id_key ON public.bundle_product_component USING btree (product_id, component_id) WHERE (deleted_at IS NULL);


--
-- Name: card_is_default_customer_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX card_is_default_customer_id_key ON public.card USING btree (is_default, customer_id) WHERE ((deleted_at IS NULL) AND (is_default = true));


--
-- Name: cart_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cart_user_id_key ON public.cart USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: customer_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX customer_user_id_key ON public.customer USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: owner_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX owner_user_id_key ON public.owner USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: product_name_beach_bar_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_name_beach_bar_id_key ON public.product USING btree (name, beach_bar_id) WHERE (deleted_at IS NULL);


--
-- Name: product_reservation_limit_product_date_start_time_end_time_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX product_reservation_limit_product_date_start_time_end_time_key ON public.product_reservation_limit USING btree (date, product_id, start_time_id, end_time_id) WHERE (deleted_at IS NULL);


--
-- Name: restaurant_food_item_restaurant_id_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX restaurant_food_item_restaurant_id_name_key ON public.restaurant_food_item USING btree (restaurant_id, name) WHERE (deleted_at IS NULL);


--
-- Name: search_input_value_beach_bar_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX search_input_value_beach_bar_id_key ON public.search_input_value USING btree (beach_bar_id) WHERE (deleted_at IS NULL);


--
-- Name: service_beach_bar_beach_bar_id_service_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX service_beach_bar_beach_bar_id_service_id_key ON public.beach_bar_feature USING btree (beach_bar_id, service_id) WHERE (deleted_at IS NULL);


--
-- Name: user_hashtag_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_hashtag_id_key ON public."user" USING btree (hashtag_id) WHERE (deleted_at IS NULL);


--
-- Name: beach_bar_location calculate_beach_bar_location_where_is_column; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_beach_bar_location_where_is_column BEFORE INSERT OR UPDATE OF latitude, longitude ON public.beach_bar_location FOR EACH ROW EXECUTE FUNCTION public.calculate_where_is_geography_column();


--
-- Name: cart_product calculate_cart_product_total; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_cart_product_total AFTER INSERT OR UPDATE ON public.cart_product FOR EACH ROW EXECUTE FUNCTION public.calculate_cart_product_total_on_insert_or_update();


--
-- Name: cart_product calculate_cart_product_total_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_cart_product_total_delete AFTER DELETE ON public.cart_product FOR EACH ROW EXECUTE FUNCTION public.calculate_cart_product_total_on_delete();


--
-- Name: product calculate_cart_updated_product_total; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_cart_updated_product_total AFTER UPDATE OF price ON public.product FOR EACH ROW EXECUTE FUNCTION public.calculate_cart_total_on_product();


--
-- Name: product_price_history calculate_product_price_history; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_product_price_history BEFORE INSERT OR UPDATE ON public.product_price_history FOR EACH ROW EXECUTE FUNCTION public.calculate_product_price_history();


--
-- Name: voting_result calculate_vote_tag_total_votes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_vote_tag_total_votes BEFORE INSERT OR DELETE OR UPDATE OF upvotes, downvotes ON public.voting_result FOR EACH ROW EXECUTE FUNCTION public.calculate_total_votes();


--
-- Name: beach_bar_review calculcate_beach_bar_avg_rating; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculcate_beach_bar_avg_rating AFTER INSERT OR DELETE OR UPDATE OF rating_value ON public.beach_bar_review FOR EACH ROW EXECUTE FUNCTION public.calculate_avg_rating();


--
-- Name: currency_product_price updated_at_modified_user_column; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_at_modified_user_column BEFORE UPDATE ON public.currency_product_price FOR EACH ROW EXECUTE FUNCTION public.trigger_update_modified_column();


--
-- Name: account account_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id) ON DELETE SET NULL;


--
-- Name: account account_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE SET NULL;


--
-- Name: account account_tel_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_tel_country_id_fkey FOREIGN KEY (tel_country_id) REFERENCES public.country(id);


--
-- Name: account account_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: beach_bar beach_bar_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.beach_bar_category(id) ON DELETE RESTRICT;


--
-- Name: beach_bar beach_bar_closing_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_closing_time_id_fkey FOREIGN KEY (closing_time_id) REFERENCES public.quarter_time(id) ON DELETE CASCADE;


--
-- Name: beach_bar beach_bar_default_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_default_currency_id_fkey FOREIGN KEY (default_currency_id) REFERENCES public.currency(id);


--
-- Name: beach_bar_entry_fee beach_bar_entry_fee_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_entry_fee
    ADD CONSTRAINT beach_bar_entry_fee_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: beach_bar beach_bar_fee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_fee_id_fkey FOREIGN KEY (fee_id) REFERENCES public.pricing_fee(id) ON DELETE RESTRICT;


--
-- Name: beach_bar_img_url beach_bar_img_url_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_img_url
    ADD CONSTRAINT beach_bar_img_url_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: beach_bar_location beach_bar_location_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: beach_bar_location beach_bar_location_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id) ON DELETE CASCADE;


--
-- Name: beach_bar_location beach_bar_location_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE CASCADE;


--
-- Name: beach_bar_location beach_bar_location_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_location
    ADD CONSTRAINT beach_bar_location_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.region(id) ON DELETE SET NULL;


--
-- Name: beach_bar beach_bar_opening_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar
    ADD CONSTRAINT beach_bar_opening_time_id_fkey FOREIGN KEY (opening_time_id) REFERENCES public.quarter_time(id) ON DELETE CASCADE;


--
-- Name: beach_bar_restaurant beach_bar_restaurant_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_restaurant
    ADD CONSTRAINT beach_bar_restaurant_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id);


--
-- Name: beach_bar_review beach_bar_review_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id);


--
-- Name: beach_bar_review beach_bar_review_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON DELETE CASCADE;


--
-- Name: beach_bar_review beach_bar_review_month_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_month_time_id_fkey FOREIGN KEY (month_time_id) REFERENCES public.month_time(id) ON DELETE RESTRICT;


--
-- Name: beach_bar_review beach_bar_review_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE;


--
-- Name: beach_bar_review beach_bar_review_visit_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_review
    ADD CONSTRAINT beach_bar_review_visit_type_id_fkey FOREIGN KEY (visit_type_id) REFERENCES public.review_visit_type(id);


--
-- Name: beach_bar_type beach_bar_type_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_type
    ADD CONSTRAINT beach_bar_type_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: beach_bar_type beach_bar_type_style_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_type
    ADD CONSTRAINT beach_bar_type_style_id_fkey FOREIGN KEY (style_id) REFERENCES public.beach_bar_style(id) ON DELETE CASCADE;


--
-- Name: bundle_product_component bundle_product_component_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bundle_product_component
    ADD CONSTRAINT bundle_product_component_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.product_component(id);


--
-- Name: bundle_product_component bundle_product_component_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bundle_product_component
    ADD CONSTRAINT bundle_product_component_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: card card_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.card_brand(id);


--
-- Name: card card_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id);


--
-- Name: card card_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id);


--
-- Name: cart_product cart_product_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_product
    ADD CONSTRAINT cart_product_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- Name: cart_product cart_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_product
    ADD CONSTRAINT cart_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: cart_product cart_product_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_product
    ADD CONSTRAINT cart_product_time_id_fkey FOREIGN KEY (time_id) REFERENCES public.hour_time(id) ON DELETE RESTRICT;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: city city_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE CASCADE;


--
-- Name: country country_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON DELETE RESTRICT;


--
-- Name: coupon_code coupon_code_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_code
    ADD CONSTRAINT coupon_code_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: currency_product_price currency_product_price_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency_product_price
    ADD CONSTRAINT currency_product_price_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: customer customer_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE CASCADE;


--
-- Name: customer customer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: login_details login_details_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: login_details login_details_browser_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_browser_id_fkey FOREIGN KEY (browser_id) REFERENCES public.client_browser(id) ON DELETE SET NULL;


--
-- Name: login_details login_details_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE SET NULL;


--
-- Name: login_details login_details_os_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_os_id_fkey FOREIGN KEY (os_id) REFERENCES public.client_os(id) ON DELETE SET NULL;


--
-- Name: login_details login_details_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.login_platform(id) ON DELETE SET NULL;


--
-- Name: offer_campaign_product offer_campaign_product_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign_product
    ADD CONSTRAINT offer_campaign_product_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.offer_campaign(id) ON DELETE CASCADE;


--
-- Name: offer_campaign_product offer_campaign_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offer_campaign_product
    ADD CONSTRAINT offer_campaign_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: beach_bar_owner owner_beach_bar_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_owner
    ADD CONSTRAINT owner_beach_bar_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id);


--
-- Name: beach_bar_owner owner_beach_bar_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_owner
    ADD CONSTRAINT owner_beach_bar_user_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON DELETE RESTRICT;


--
-- Name: owner owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT owner_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payment payment_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.card(id) ON DELETE CASCADE;


--
-- Name: payment payment_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON DELETE CASCADE;


--
-- Name: payment payment_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.payment_status(id) ON DELETE RESTRICT;


--
-- Name: payment_voucher_code payment_voucher_code_coupon_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code
    ADD CONSTRAINT payment_voucher_code_coupon_code_id_fkey FOREIGN KEY (coupon_code_id) REFERENCES public.coupon_code(id) ON DELETE SET NULL;


--
-- Name: payment_voucher_code payment_voucher_code_offer_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code
    ADD CONSTRAINT payment_voucher_code_offer_code_id_fkey FOREIGN KEY (offer_code_id) REFERENCES public.offer_campaign_code(id) ON DELETE SET NULL;


--
-- Name: payment_voucher_code payment_voucher_code_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_voucher_code
    ADD CONSTRAINT payment_voucher_code_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: pricing_fee_currency pricing_fee_currency_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_fee_currency
    ADD CONSTRAINT pricing_fee_currency_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON DELETE RESTRICT;


--
-- Name: product product_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: product_category_component product_category_component_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_component
    ADD CONSTRAINT product_category_component_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_category(id);


--
-- Name: product_category_component product_category_component_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_component
    ADD CONSTRAINT product_category_component_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.product_component(id);


--
-- Name: product product_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_category(id);


--
-- Name: product product_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON DELETE RESTRICT;


--
-- Name: product_price_history product_price_history_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history
    ADD CONSTRAINT product_price_history_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON DELETE CASCADE;


--
-- Name: product_price_history product_price_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history
    ADD CONSTRAINT product_price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: product_reservation_limit product_reservation_limit_end_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reservation_limit
    ADD CONSTRAINT product_reservation_limit_end_time_id_fkey FOREIGN KEY (end_time_id) REFERENCES public.hour_time(id) ON DELETE RESTRICT;


--
-- Name: product_reservation_limit product_reservation_limit_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reservation_limit
    ADD CONSTRAINT product_reservation_limit_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: product_reservation_limit product_reservation_limit_start_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_reservation_limit
    ADD CONSTRAINT product_reservation_limit_start_time_id_fkey FOREIGN KEY (start_time_id) REFERENCES public.hour_time(id) ON DELETE RESTRICT;


--
-- Name: region region_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id) ON DELETE CASCADE;


--
-- Name: region region_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE CASCADE;


--
-- Name: reserved_product reserved_product_time_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserved_product
    ADD CONSTRAINT reserved_product_time_id_fkey FOREIGN KEY (time_id) REFERENCES public.hour_time(id) ON DELETE RESTRICT;


--
-- Name: reserved_product reserved_products_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserved_product
    ADD CONSTRAINT reserved_products_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON DELETE CASCADE;


--
-- Name: reserved_product reserved_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reserved_product
    ADD CONSTRAINT reserved_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: restaurant_food_item restaurant_food_item_menu_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_food_item
    ADD CONSTRAINT restaurant_food_item_menu_category_id_fkey FOREIGN KEY (menu_category_id) REFERENCES public.restaurant_menu_category(id);


--
-- Name: restaurant_food_item restaurant_food_item_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_food_item
    ADD CONSTRAINT restaurant_food_item_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.beach_bar_restaurant(id);


--
-- Name: review_answer review_answer_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_answer
    ADD CONSTRAINT review_answer_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.beach_bar_review(id) ON DELETE CASCADE;


--
-- Name: review_vote review_vote_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote
    ADD CONSTRAINT review_vote_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.beach_bar_review(id);


--
-- Name: review_vote review_vote_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote
    ADD CONSTRAINT review_vote_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.review_vote_type(id);


--
-- Name: review_vote review_vote_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_vote
    ADD CONSTRAINT review_vote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: search_filter_section search_filter_section_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter_section
    ADD CONSTRAINT search_filter_section_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.search_filter_category(id) ON DELETE RESTRICT;


--
-- Name: search_filter_section search_filter_section_filter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_filter_section
    ADD CONSTRAINT search_filter_section_filter_id_fkey FOREIGN KEY (filter_id) REFERENCES public.search_filter(id) ON DELETE RESTRICT;


--
-- Name: search_input_value search_input_value_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: search_input_value search_input_value_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id) ON DELETE CASCADE;


--
-- Name: search_input_value search_input_value_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE CASCADE;


--
-- Name: search_input_value search_input_value_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_input_value
    ADD CONSTRAINT search_input_value_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.region(id) ON DELETE CASCADE;


--
-- Name: beach_bar_feature service_beach_bar_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_feature
    ADD CONSTRAINT service_beach_bar_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id);


--
-- Name: beach_bar_feature service_beach_bar_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beach_bar_feature
    ADD CONSTRAINT service_beach_bar_feature_id_fkey FOREIGN KEY (service_id) REFERENCES public.beach_bar_service(id);


--
-- Name: stripe_fee stripe_fee_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_fee
    ADD CONSTRAINT stripe_fee_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON DELETE RESTRICT;


--
-- Name: stripe_minimum_currency stripe_minimum_currency_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripe_minimum_currency
    ADD CONSTRAINT stripe_minimum_currency_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currency(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_contact_details user_contact_details_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contact_details
    ADD CONSTRAINT user_contact_details_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id) ON DELETE RESTRICT;


--
-- Name: user_contact_details user_contact_details_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_contact_details
    ADD CONSTRAINT user_contact_details_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.country(id) ON DELETE SET NULL;


--
-- Name: user_favorite_bar user_favorite_bar_beach_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorite_bar
    ADD CONSTRAINT user_favorite_bar_beach_bar_id_fkey FOREIGN KEY (beach_bar_id) REFERENCES public.beach_bar(id) ON DELETE CASCADE;


--
-- Name: user_favorite_bar user_favorite_bar_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_favorite_bar
    ADD CONSTRAINT user_favorite_bar_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_history user_history_activity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history
    ADD CONSTRAINT user_history_activity_id_fkey FOREIGN KEY (activity_id) REFERENCES public.user_history_activity(id) ON DELETE RESTRICT;


--
-- Name: user_history user_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_history
    ADD CONSTRAINT user_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: user_search_filter user_search_filter_filter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search_filter
    ADD CONSTRAINT user_search_filter_filter_id_fkey FOREIGN KEY (filter_id) REFERENCES public.search_filter(id) ON DELETE CASCADE;


--
-- Name: user_search_filter user_search_filter_search_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search_filter
    ADD CONSTRAINT user_search_filter_search_id_fkey FOREIGN KEY (search_id) REFERENCES public.user_search(id) ON DELETE CASCADE;


--
-- Name: user_search user_search_sort_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search
    ADD CONSTRAINT user_search_sort_id_fkey FOREIGN KEY (sort_id) REFERENCES public.search_sort(id);


--
-- Name: user_search user_search_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_search
    ADD CONSTRAINT user_search_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: vote vote_feedback_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.voting_feedback(id) ON DELETE CASCADE;


--
-- Name: vote vote_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vote
    ADD CONSTRAINT vote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: voting_result voting_result_feedback_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voting_result
    ADD CONSTRAINT voting_result_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.voting_feedback(id) ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;


--
-- Name: COLUMN cart.total; Type: ACL; Schema: public; Owner: postgres
--

GRANT UPDATE(total) ON TABLE public.cart TO postgres;


--
-- PostgreSQL database dump complete
--

