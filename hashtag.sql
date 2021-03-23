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
-- Name: email; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.email AS character varying(255) NOT NULL
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
    id bigint NOT NULL,
    client_id character varying(64) NOT NULL,
    user_id bigint NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    refresh_token_limit integer DEFAULT 15300,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
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
-- Name: city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.city (
    id bigint NOT NULL,
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
-- Name: hashtag_community_platform; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hashtag_community_platform (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    url_hostname character varying(255) NOT NULL,
    is_primary boolean DEFAULT false
);


ALTER TABLE public.hashtag_community_platform OWNER TO postgres;

--
-- Name: login_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_details (
    id bigint NOT NULL,
    account_id bigint NOT NULL,
    status public.login_details_status DEFAULT 'failed'::public.login_details_status NOT NULL,
    os_id integer,
    browser_id integer,
    country_id integer,
    city_id integer,
    ip_addr cidr,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
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
-- Name: oauth_api; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_api (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    url_hostname character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.oauth_api OWNER TO postgres;

--
-- Name: oauth_api_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_api_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_api_id_seq OWNER TO postgres;

--
-- Name: oauth_api_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_api_id_seq OWNED BY public.oauth_api.id;


--
-- Name: oauth_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_client (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    client_id character varying(64) NOT NULL,
    client_secret character varying(64) NOT NULL,
    description text,
    logo_url text,
    is_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    user_id bigint NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.oauth_client OWNER TO postgres;

--
-- Name: oauth_client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_client_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_client_id_seq OWNER TO postgres;

--
-- Name: oauth_client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_client_id_seq OWNED BY public.oauth_client.id;


--
-- Name: oauth_client_origin_uri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_client_origin_uri (
    id bigint NOT NULL,
    value text NOT NULL,
    client_id character varying(64) NOT NULL
);


ALTER TABLE public.oauth_client_origin_uri OWNER TO postgres;

--
-- Name: oauth_client_origin_uri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_client_origin_uri_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_client_origin_uri_id_seq OWNER TO postgres;

--
-- Name: oauth_client_origin_uri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_client_origin_uri_id_seq OWNED BY public.oauth_client_origin_uri.id;


--
-- Name: oauth_client_redirect_uri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_client_redirect_uri (
    id bigint NOT NULL,
    value text NOT NULL,
    client_id character varying(64) NOT NULL
);


ALTER TABLE public.oauth_client_redirect_uri OWNER TO postgres;

--
-- Name: oauth_client_redirect_uri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_client_redirect_uri_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_client_redirect_uri_id_seq OWNER TO postgres;

--
-- Name: oauth_client_redirect_uri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_client_redirect_uri_id_seq OWNED BY public.oauth_client_redirect_uri.id;


--
-- Name: oauth_client_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_client_scope (
    client_id bigint NOT NULL,
    scope_id integer NOT NULL
);


ALTER TABLE public.oauth_client_scope OWNER TO postgres;

--
-- Name: oauth_scope; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oauth_scope (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    api_id integer NOT NULL,
    description text NOT NULL,
    public_id character varying(8) NOT NULL,
    public_use boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT check_public_id_length CHECK ((length((public_id)::text) = 8))
);


ALTER TABLE public.oauth_scope OWNER TO postgres;

--
-- Name: oauth_scope_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oauth_scope_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.oauth_scope_id_seq OWNER TO postgres;

--
-- Name: oauth_scope_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oauth_scope_id_seq OWNED BY public.oauth_scope.id;


--
-- Name: platform_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platform_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.platform_id_seq OWNER TO postgres;

--
-- Name: platform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platform_id_seq OWNED BY public.hashtag_community_platform.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    email public.email NOT NULL,
    password character varying(60) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    token_version integer DEFAULT 0 NOT NULL,
    forgot_password_locked boolean DEFAULT false NOT NULL,
    country_id integer,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    picture_url text,
    deleted_at timestamp with time zone,
    city_id integer,
    birthday date,
    age smallint
);


ALTER TABLE public."user" OWNER TO postgres;

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
-- Name: account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


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
-- Name: hashtag_community_platform id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtag_community_platform ALTER COLUMN id SET DEFAULT nextval('public.platform_id_seq'::regclass);


--
-- Name: login_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details ALTER COLUMN id SET DEFAULT nextval('public.login_details_id_seq'::regclass);


--
-- Name: oauth_api id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_api ALTER COLUMN id SET DEFAULT nextval('public.oauth_api_id_seq'::regclass);


--
-- Name: oauth_client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client ALTER COLUMN id SET DEFAULT nextval('public.oauth_client_id_seq'::regclass);


--
-- Name: oauth_client_origin_uri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_origin_uri ALTER COLUMN id SET DEFAULT nextval('public.oauth_client_origin_uri_id_seq'::regclass);


--
-- Name: oauth_client_redirect_uri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_redirect_uri ALTER COLUMN id SET DEFAULT nextval('public.oauth_client_redirect_uri_id_seq'::regclass);


--
-- Name: oauth_scope id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_scope ALTER COLUMN id SET DEFAULT nextval('public.oauth_scope_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, client_id, user_id, is_active, refresh_token_limit, deleted_at, updated_at, "timestamp") FROM stdin;
62	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5	40	f	1	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
77	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	46	f	15300	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
78	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	47	f	15300	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
114	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5	42	f	15300	2020-06-17 20:32:55.589939+03	2020-06-17 20:32:55.589939+03	2020-06-17 20:21:53.677379+03
71	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	42	f	\N	2020-06-17 20:32:55.608792+03	2020-06-17 20:32:55.608792+03	2020-06-14 13:32:11.687595+03
55	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	2	f	-5	2020-06-25 23:17:21.967382+03	2020-06-25 23:17:21.967382+03	2020-06-14 13:32:11.687595+03
112	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	81	t	15300	\N	2020-06-17 13:47:15.990387+03	2020-06-14 21:39:56.037283+03
69	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	2	f	\N	2020-06-25 23:17:22.056344+03	2020-06-25 23:17:22.056344+03	2020-06-14 13:32:11.687595+03
60	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5	2	f	2	2020-06-25 23:17:22.106121+03	2020-06-25 23:17:22.106121+03	2020-06-14 13:32:11.687595+03
117	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	82	t	15300	\N	2020-06-24 16:34:35.184351+03	2020-06-24 16:34:19.789614+03
70	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	41	f	\N	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
68	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5	2	f	\N	2020-06-25 23:17:22.173012+03	2020-06-25 23:17:22.173012+03	2020-06-14 13:32:11.687595+03
65	52c3d5a192cf8e9630870eb9f372a93f983177257413eeece4a364d01cfc6b1b	2	f	1	2020-06-25 23:17:22.244468+03	2020-06-25 23:17:22.244468+03	2020-06-14 13:32:11.687595+03
74	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	43	f	\N	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
75	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	44	f	\N	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
76	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	45	f	\N	\N	2020-06-14 13:31:58.753414+03	2020-06-14 13:32:11.687595+03
116	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	6	t	15280	\N	2020-06-22 15:31:26.540477+03	2020-06-18 18:56:10.34525+03
120	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	5	f	15300	\N	2020-10-17 23:30:12.043255+03	2020-10-17 23:30:12.043255+03
121	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	85	t	15300	\N	2020-10-17 23:34:00.102258+03	2020-10-17 23:33:50.798203+03
111	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	80	t	15300	\N	2020-06-15 23:43:19.209737+03	2020-06-14 21:32:52.840561+03
118	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	83	t	15300	\N	2020-06-24 17:37:03.103662+03	2020-06-24 17:36:59.625806+03
122	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	86	f	15300	\N	2021-03-07 00:41:36.790424+02	2021-03-07 00:41:36.790424+02
123	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	87	f	15300	\N	2021-03-07 00:44:42.300641+02	2021-03-07 00:44:42.300641+02
124	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	88	f	15300	\N	2021-03-07 00:45:51.858728+02	2021-03-07 00:45:51.858728+02
125	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	89	f	15300	\N	2021-03-07 00:52:01.379618+02	2021-03-07 00:52:01.379618+02
126	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	90	f	15300	\N	2021-03-07 00:53:40.621266+02	2021-03-07 00:53:40.621266+02
127	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	91	f	15300	\N	2021-03-07 01:02:40.270393+02	2021-03-07 01:02:40.270393+02
128	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	92	f	15300	\N	2021-03-07 01:03:15.000007+02	2021-03-07 01:03:15.000007+02
119	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	84	t	15094	\N	2021-03-09 13:46:24.697908+02	2020-06-25 23:59:07.069172+03
\.


--
-- Data for Name: city; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.city (id, name, country_id) FROM stdin;
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
-- Data for Name: hashtag_community_platform; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hashtag_community_platform (id, name, url_hostname, is_primary) FROM stdin;
2	#beach_bar	https://www.beachbar.com	t
1	#hashtag	https://www.hashtag.com	t
\.


--
-- Data for Name: login_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_details (id, account_id, status, os_id, browser_id, country_id, city_id, ip_addr, "timestamp") FROM stdin;
671	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:54:22.122755+03
679	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:01:30.437735+03
675	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:58:40.20428+03
9	8	invalid_password	\N	\N	\N	\N	\N	2020-05-28 17:39:33.742255+03
10	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:39:46.042285+03
11	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:41:07.171126+03
12	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:43:32.49548+03
13	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:45:58.657208+03
14	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:47:12.499413+03
15	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:50:14.840621+03
16	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 17:51:53.077256+03
17	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 18:04:01.641297+03
18	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 18:05:09.123701+03
19	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 18:06:36.415965+03
20	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 18:08:07.944295+03
21	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 18:09:47.761844+03
22	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 20:39:05.563817+03
23	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 20:43:28.265437+03
24	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 20:49:22.412586+03
25	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 20:57:33.634478+03
26	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:00:19.140298+03
27	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:05:39.073821+03
28	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:05:45.214902+03
29	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:07:33.682955+03
30	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:12:32.219728+03
31	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:14:56.949929+03
32	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:17:24.34552+03
33	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:17:29.142524+03
34	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:20:23.408418+03
35	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:20:30.24037+03
36	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:30:42.762941+03
37	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:30:48.97142+03
38	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:46:13.938541+03
39	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:46:19.256251+03
40	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:49:02.89046+03
41	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 21:51:58.123306+03
42	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:13:59.548832+03
43	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:16:59.496017+03
44	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:21:51.095626+03
45	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:23:54.725418+03
46	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:33:05.129731+03
47	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 22:57:46.109501+03
48	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 23:28:11.283286+03
49	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 23:37:23.323383+03
50	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 23:42:28.476567+03
51	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 23:42:29.313394+03
52	8	logged_in	\N	\N	\N	\N	\N	2020-05-28 23:42:40.539174+03
53	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:30:04.511884+03
54	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:30:15.091082+03
55	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:31:34.725233+03
56	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:33:25.391283+03
57	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:35:11.897258+03
58	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:37:00.15904+03
59	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:37:07.965861+03
60	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:37:24.521983+03
61	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 17:49:51.830263+03
62	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 18:04:23.261526+03
63	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 18:04:34.884991+03
64	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 18:05:18.985257+03
65	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 18:17:28.009884+03
66	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 18:49:25.57981+03
67	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:37:56.753909+03
68	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:38:37.387834+03
69	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:49:21.162818+03
70	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:50:00.77213+03
71	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:54:26.087047+03
72	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:55:01.125217+03
73	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:55:15.713255+03
74	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:55:41.026986+03
75	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:55:47.661892+03
76	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:56:00.792101+03
77	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:56:06.855242+03
78	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:56:24.131881+03
79	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 19:56:37.39723+03
80	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:41:49.621514+03
81	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:42:00.835691+03
82	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:42:33.974785+03
83	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:43:48.15968+03
84	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:54:47.151925+03
85	6	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:55:29.262951+03
86	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:56:41.067524+03
87	6	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:57:02.20781+03
88	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 22:57:16.042607+03
89	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:07:12.146683+03
90	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:13:47.387963+03
91	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:23:24.897928+03
92	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:23:32.957408+03
93	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:25:48.936471+03
94	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:26:02.702823+03
95	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:27:28.83747+03
96	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:32:13.51537+03
97	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:35:00.056117+03
98	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:35:04.61045+03
99	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:40:28.756971+03
100	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:44:12.461592+03
101	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:44:58.461607+03
102	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:49:57.114613+03
103	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:50:44.025872+03
104	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:51:09.141622+03
105	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:51:27.932764+03
106	8	logged_in	\N	\N	\N	\N	\N	2020-05-29 23:52:16.882522+03
107	8	logged_in	\N	\N	\N	\N	\N	2020-05-30 00:09:48.212052+03
108	8	logged_in	\N	\N	\N	\N	\N	2020-05-30 00:10:12.746321+03
109	8	logged_in	\N	\N	\N	\N	\N	2020-05-30 00:12:19.918637+03
110	8	logged_in	\N	\N	\N	\N	\N	2020-05-30 11:54:23.984308+03
111	45	logged_in	\N	\N	\N	\N	\N	2020-05-30 13:13:12.721455+03
112	46	logged_in	\N	\N	\N	\N	\N	2020-05-30 13:13:28.535729+03
113	47	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:08:31.595038+03
114	48	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:09:20.730207+03
115	49	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:10:09.256677+03
116	50	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:24:44.695512+03
117	51	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:35:00.833227+03
118	52	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:39:45.643722+03
119	8	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:51:40.489096+03
960	119	logged_in	\N	\N	66	\N	\N	2021-03-07 17:04:24.612009+02
963	119	logged_in	\N	\N	66	\N	\N	2021-03-09 12:19:03.17176+02
333	55	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:57:54.43951+03
684	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:07:36.870661+03
952	119	logged_in	21	\N	\N	\N	94.69.16.206/32	2021-03-07 16:36:57.320394+02
120	53	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:52:36.596661+03
121	53	logged_in	\N	\N	\N	\N	\N	2020-05-30 17:52:44.621732+03
122	53	logged_in	\N	\N	\N	\N	\N	2020-05-30 18:18:53.904694+03
123	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 18:48:08.190266+03
124	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 18:49:04.23585+03
125	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 19:10:10.237649+03
126	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 19:10:34.387144+03
127	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 19:11:44.012147+03
128	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 19:13:07.930295+03
129	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 19:13:36.783961+03
130	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 21:55:36.719082+03
131	54	logged_in	\N	\N	\N	\N	\N	2020-05-30 23:12:50.13378+03
132	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 01:05:02.71621+03
133	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 01:23:18.533249+03
134	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 01:47:00.11031+03
135	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 01:59:19.028671+03
136	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 11:13:42.647913+03
137	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 17:19:36.850674+03
138	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:09:08.032883+03
139	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:33:54.818006+03
140	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:46:32.386516+03
141	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:47:07.113821+03
142	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:47:27.54178+03
143	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 18:59:30.238737+03
144	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 19:05:00.156334+03
145	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 19:05:32.356086+03
146	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 19:05:48.203441+03
147	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 19:54:47.708164+03
148	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 20:29:58.209562+03
149	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 20:38:05.542818+03
150	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 20:38:10.868984+03
151	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:14:39.755255+03
152	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:26:37.088511+03
153	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:27:53.454018+03
154	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:29:54.373967+03
155	56	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:33:05.32817+03
156	56	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:43:55.186883+03
157	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:44:41.685388+03
158	55	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:49:01.141567+03
159	57	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:50:58.924229+03
160	58	logged_in	\N	\N	\N	\N	\N	2020-05-31 21:51:44.045753+03
161	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:01:46.865679+03
162	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:46:43.513116+03
163	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:55:07.164116+03
164	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:56:03.500358+03
165	60	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:56:37.642444+03
166	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 22:57:17.429647+03
167	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 23:13:43.205211+03
168	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 23:22:45.118319+03
169	59	logged_in	\N	\N	\N	\N	\N	2020-06-01 23:25:12.688096+03
170	59	logged_in	\N	\N	\N	\N	\N	2020-06-02 16:06:26.307218+03
171	60	logged_in	\N	\N	\N	\N	\N	2020-06-02 22:47:01.472824+03
172	60	logged_in	\N	\N	\N	\N	\N	2020-06-02 23:11:15.196586+03
173	60	logged_in	\N	\N	\N	\N	\N	2020-06-02 23:28:42.029118+03
174	59	logged_in	\N	\N	\N	\N	\N	2020-06-02 23:30:39.723254+03
175	63	logged_in	\N	\N	\N	\N	\N	2020-06-03 15:41:32.103966+03
176	59	logged_in	\N	\N	\N	\N	\N	2020-06-03 15:47:59.536674+03
177	63	logged_in	\N	\N	\N	\N	\N	2020-06-03 15:55:02.196324+03
178	64	logged_in	\N	\N	\N	\N	\N	2020-06-03 16:03:05.339079+03
179	64	logged_in	\N	\N	\N	\N	\N	2020-06-03 16:24:22.961533+03
180	65	invalid_password	\N	\N	\N	\N	\N	2020-06-03 16:49:50.329094+03
181	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 16:49:55.262654+03
182	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 16:51:34.389696+03
183	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:28:22.775031+03
184	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:48:40.630508+03
185	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:48:47.316866+03
186	65	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:48:54.348246+03
187	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:49:59.044169+03
188	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:54:49.57976+03
189	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 21:57:36.284862+03
190	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 22:03:17.01414+03
191	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 22:10:05.932371+03
192	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 22:10:49.894909+03
193	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 22:32:28.77836+03
194	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 23:06:36.325136+03
195	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 23:17:21.445721+03
196	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 23:37:02.815836+03
197	60	logged_in	\N	\N	\N	\N	\N	2020-06-03 23:55:35.215769+03
198	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 00:12:42.157781+03
199	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 13:17:30.588366+03
200	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:04:20.089573+03
201	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:04:54.017559+03
202	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:05:27.075557+03
203	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:05:49.394806+03
204	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:06:04.900123+03
205	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:06:28.442572+03
206	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:06:39.945516+03
207	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:06:59.286299+03
208	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:09:48.226806+03
209	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:11:49.190615+03
210	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:12:47.488201+03
211	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:21:49.93415+03
212	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:22:59.023492+03
213	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:27:34.680247+03
214	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:31:01.516115+03
215	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:32:24.532223+03
216	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:32:48.67413+03
217	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:33:49.949429+03
218	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 14:34:01.1532+03
219	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:01:10.267664+03
220	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:01:28.77654+03
221	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:02:58.785957+03
222	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:04:20.534923+03
223	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:07:50.131555+03
224	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:08:04.111553+03
225	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:09:49.78728+03
226	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:10:07.734974+03
227	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 15:27:51.40891+03
228	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 18:30:50.521438+03
229	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 18:36:06.169957+03
230	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 21:11:24.659056+03
231	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 21:37:45.548096+03
232	60	logged_in	\N	\N	\N	\N	\N	2020-06-04 22:57:43.836567+03
233	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 15:27:55.742852+03
234	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 15:36:20.318552+03
235	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 15:36:56.30778+03
236	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 15:48:35.984845+03
237	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 15:48:58.679445+03
238	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 16:50:34.295038+03
239	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 16:51:16.527713+03
240	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 16:51:28.376978+03
241	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 21:12:10.589087+03
242	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 21:14:55.582702+03
243	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 21:23:41.025984+03
244	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 21:31:12.800025+03
245	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 21:42:51.773563+03
246	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 22:39:00.576115+03
247	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 22:43:39.039754+03
248	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 22:47:58.416492+03
249	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:54:10.135589+03
250	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:54:24.77913+03
251	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:54:28.252024+03
252	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:55:23.759658+03
253	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:55:51.428237+03
254	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:59:04.487349+03
255	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:59:21.805975+03
256	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:59:29.766101+03
257	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:59:36.673671+03
258	60	logged_in	\N	\N	\N	\N	\N	2020-06-05 23:59:55.378802+03
259	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:07:28.031889+03
260	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:10:06.06866+03
261	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:20:42.086413+03
262	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:20:52.640603+03
263	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:22:02.154863+03
264	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:28:24.020865+03
265	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 00:28:29.972019+03
266	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 12:02:44.795306+03
267	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 12:04:00.645843+03
268	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 12:47:00.85231+03
269	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 12:50:45.422287+03
270	60	logged_in	\N	\N	\N	\N	\N	2020-06-06 12:51:29.886373+03
271	68	invalid_password	\N	\N	\N	\N	\N	2020-06-08 00:19:10.819658+03
272	68	logged_in	\N	\N	\N	\N	\N	2020-06-08 00:19:21.972198+03
273	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 00:20:38.336496+03
274	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:08:46.764969+03
275	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:23:56.21301+03
276	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:34:02.028338+03
277	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:34:06.745125+03
278	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:50:07.574465+03
279	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:50:52.178819+03
280	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 16:55:07.905104+03
281	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:04:21.190362+03
282	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:09:46.307254+03
283	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:18:35.276089+03
284	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:24:11.803193+03
285	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:28:15.867179+03
286	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:34:45.499075+03
287	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:40:15.002221+03
288	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:45:34.266594+03
289	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:53:31.522666+03
290	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 17:59:15.502041+03
291	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:08:30.583443+03
292	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:16:48.228935+03
293	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:30:39.347299+03
294	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:43:04.26274+03
295	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:50:52.227785+03
296	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 18:57:06.395422+03
297	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:01:39.245742+03
298	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:06:22.295092+03
299	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:06:31.178971+03
300	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:06:53.928299+03
301	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:29:11.721727+03
302	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:29:28.625552+03
303	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:35:06.133163+03
304	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:35:08.443684+03
305	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:35:26.41816+03
306	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:39:29.258367+03
307	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:44:24.303442+03
308	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:44:44.872869+03
309	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:53:25.12544+03
310	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:53:53.37898+03
311	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 19:59:48.250578+03
312	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 20:37:28.896542+03
961	119	logged_in	\N	\N	66	\N	\N	2021-03-07 17:05:37.460852+02
964	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-09 12:24:27.840325+02
336	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 11:28:23.111712+03
966	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-09 12:24:39.351781+02
338	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 16:31:11.747007+03
970	119	logged_in	\N	\N	66	\N	\N	2021-03-10 08:47:02.897014+02
340	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 16:52:42.449442+03
982	119	logged_in	\N	\N	66	\N	\N	2021-03-11 15:02:50.884453+02
995	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:00:45.462117+02
343	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 22:57:51.310201+03
1002	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:10:05.750589+02
1012	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:46:15.920706+02
346	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 00:03:25.182118+03
1021	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:43:24.86278+02
1027	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:54:11.163988+02
1033	119	logged_in	\N	\N	66	\N	\N	2021-03-16 12:24:59.203731+02
351	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 10:57:23.199921+03
352	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 12:52:22.213567+03
353	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 12:52:24.916305+03
355	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 13:01:28.214037+03
356	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 13:36:52.837472+03
357	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 13:44:12.491871+03
358	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 14:02:13.539182+03
359	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 14:02:13.760623+03
360	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 14:13:53.062834+03
361	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 14:13:53.070638+03
362	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 14:20:34.66993+03
363	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:27:38.375698+03
364	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:35:28.449185+03
365	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:40:43.207843+03
366	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:48:26.07045+03
367	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:49:03.113807+03
368	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 20:57:42.127381+03
369	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:01:37.725053+03
370	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:01:53.822404+03
371	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:11:32.606908+03
372	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:16:50.549669+03
373	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:38:34.568594+03
374	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 21:52:58.521487+03
375	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:20:16.463897+03
376	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:20:37.397576+03
377	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:25:57.703081+03
378	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:36:18.037255+03
379	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:43:10.297257+03
380	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:52:41.433687+03
381	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 22:53:31.446437+03
382	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 23:05:41.949521+03
383	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 23:12:00.766575+03
384	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 23:12:00.993467+03
385	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 23:16:47.259833+03
418	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:15:09.2172+03
419	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:16:56.466972+03
420	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:26:39.037249+03
421	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:32:59.140186+03
422	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:33:39.204446+03
423	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 13:41:14.926294+03
424	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:01:01.47681+03
425	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:13:33.85124+03
426	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:04.485642+03
962	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-07 17:06:17.789948+02
428	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:25.212291+03
429	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:40.929366+03
965	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-09 12:24:30.709781+02
971	119	logged_in	\N	\N	66	\N	\N	2021-03-10 08:48:27.49851+02
432	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:16:07.856148+03
433	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:28:33.08615+03
983	119	logged_in	\N	\N	66	\N	\N	2021-03-11 15:40:56.50321+02
435	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:34:53.938144+03
436	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:35:03.234717+03
996	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:02:30.192443+02
1003	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:11:25.79653+02
439	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 15:27:24.865859+03
440	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 15:36:50.694328+03
1013	119	logged_in	\N	\N	66	\N	\N	2021-03-15 13:15:05.985426+02
442	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 17:03:36.939787+03
443	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 17:14:10.532208+03
444	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 20:40:19.325866+03
445	69	logged_in	\N	\N	\N	\N	\N	2020-06-13 20:47:58.081424+03
446	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 21:07:32.110137+03
447	69	logged_in	\N	\N	\N	\N	\N	2020-06-13 23:05:07.888722+03
1022	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:44:15.231563+02
449	69	logged_in	\N	\N	\N	\N	\N	2020-06-13 23:12:26.896883+03
450	69	logged_in	\N	\N	\N	\N	\N	2020-06-14 00:39:35.112226+03
1028	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:55:55.986925+02
484	69	logged_in	\N	\N	\N	\N	\N	2020-06-14 19:55:31.660395+03
485	69	logged_in	\N	\N	\N	\N	\N	2020-06-14 22:26:53.272281+03
486	69	logged_in	\N	\N	\N	\N	\N	2020-06-14 23:41:55.853146+03
487	111	logged_in	\N	\N	\N	\N	\N	2020-06-15 23:43:18.946884+03
488	111	logged_in	\N	\N	\N	\N	\N	2020-06-15 23:49:33.36324+03
489	69	logged_in	\N	\N	\N	\N	\N	2020-06-15 23:50:18.154395+03
490	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 00:29:08.817085+03
491	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:15:45.71356+03
492	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:21:36.005485+03
493	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:26:21.468129+03
494	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:30:19.195405+03
495	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:34:06.513793+03
496	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 13:54:56.210033+03
497	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 16:51:50.817944+03
498	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 17:27:14.570022+03
1034	119	logged_in	\N	\N	66	\N	\N	2021-03-16 12:35:16.354205+02
520	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 18:53:42.361855+03
521	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 19:19:03.980152+03
525	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 00:15:10.947807+03
526	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 00:17:34.036849+03
527	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 00:17:57.125403+03
528	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 08:59:10.819488+03
529	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 15:49:57.120413+03
530	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 16:05:16.634475+03
531	74	invalid_password	\N	\N	\N	\N	\N	2020-06-18 18:40:54.524328+03
532	75	invalid_password	\N	\N	\N	\N	\N	2020-06-18 18:41:11.389006+03
534	55	logged_in	\N	\N	\N	\N	\N	2020-06-18 19:06:41.141935+03
535	116	logged_in	\N	\N	\N	\N	\N	2020-06-18 19:23:17.524131+03
540	55	logged_in	\N	\N	\N	\N	\N	2020-06-20 00:02:53.444319+03
541	55	logged_in	\N	\N	\N	\N	\N	2020-06-22 15:33:40.768109+03
542	55	logged_in	\N	\N	\N	\N	\N	2020-06-23 21:09:13.779725+03
543	55	logged_in	\N	\N	\N	\N	\N	2020-06-23 22:46:08.917568+03
544	116	logged_in	\N	\N	\N	\N	\N	2020-06-24 10:32:56.366213+03
545	116	logged_in	\N	\N	\N	\N	\N	2020-06-24 11:10:28.655314+03
546	75	invalid_password	\N	\N	\N	\N	\N	2020-06-24 11:24:29.73607+03
547	117	logged_in	\N	\N	\N	\N	\N	2020-06-24 16:34:35.041124+03
548	117	logged_in	\N	\N	\N	\N	\N	2020-06-24 17:31:41.458429+03
549	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 17:37:03.052611+03
550	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 17:44:08.28481+03
551	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 18:05:08.72219+03
552	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 18:10:17.595513+03
553	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 18:17:52.751529+03
554	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 18:25:31.002321+03
555	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 18:40:13.705259+03
588	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 22:22:50.368888+03
589	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 22:32:10.748243+03
590	55	logged_in	\N	\N	\N	\N	\N	2020-06-24 22:37:16.581219+03
591	69	logged_in	\N	\N	\N	\N	\N	2020-06-24 22:46:00.31988+03
592	118	logged_in	\N	\N	\N	\N	\N	2020-06-24 22:56:02.384335+03
593	55	logged_in	\N	\N	\N	\N	\N	2020-06-25 00:02:51.577739+03
315	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 20:45:48.323007+03
316	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 20:46:00.259931+03
317	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 18:19:16.853202+03
318	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 18:19:25.439404+03
319	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 18:27:53.456215+03
320	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 18:29:00.491165+03
321	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 18:43:32.040396+03
325	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:54:13.564576+03
676	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:58:45.627197+03
680	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:04:31.69225+03
681	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:04:32.338168+03
677	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:59:09.621967+03
682	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:05:15.537729+03
674	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:58:12.274967+03
683	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:07:20.580093+03
967	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-09 12:24:58.014683+02
972	119	logged_in	\N	\N	66	\N	\N	2021-03-10 09:09:49.885015+02
330	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:38:24.479367+03
974	119	logged_in	\N	\N	66	\N	\N	2021-03-11 09:49:32.52909+02
332	55	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:45:53.060542+03
594	55	logged_in	\N	\N	\N	\N	\N	2020-06-25 01:16:28.504467+03
627	118	logged_in	\N	\N	\N	\N	\N	2020-06-25 13:23:48.548026+03
628	118	logged_in	\N	\N	\N	\N	\N	2020-06-25 13:34:04.988049+03
629	118	logged_in	\N	\N	\N	\N	\N	2020-06-25 13:41:58.861596+03
630	55	logged_in	\N	\N	\N	\N	\N	2020-06-25 16:52:17.113659+03
977	119	logged_in	\N	\N	66	\N	\N	2021-03-11 12:29:40.742462+02
632	119	logged_in	\N	\N	\N	\N	\N	2020-06-26 00:00:21.351116+03
633	119	logged_in	\N	\N	\N	\N	\N	2020-06-26 00:02:42.082895+03
984	119	logged_in	\N	\N	66	\N	\N	2021-03-11 16:46:02.401076+02
635	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 00:50:43.149747+03
636	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 00:51:37.092343+03
637	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:05:59.54349+03
638	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:09:44.236138+03
639	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:10:47.302509+03
640	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:12:51.672316+03
641	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:56:47.458457+03
642	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:57:46.098194+03
685	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:07:46.627319+03
689	121	invalid_password	\N	\N	\N	\N	\N	2020-10-18 00:15:05.260762+03
690	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:15:14.960526+03
691	119	invalid_password	\N	\N	\N	\N	\N	2020-10-18 00:15:19.033629+03
692	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:15:21.792151+03
709	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:54:27.744046+03
686	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:07:58.00221+03
707	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:43:50.655096+03
710	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 21:24:38.975445+03
672	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:56:28.040986+03
687	121	invalid_password	\N	\N	\N	\N	\N	2020-10-18 00:13:44.065202+03
688	121	invalid_password	\N	\N	\N	\N	\N	2020-10-18 00:13:49.016794+03
693	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 13:43:11.553062+03
708	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:46:54.020555+03
985	119	logged_in	\N	\N	66	\N	\N	2021-03-12 09:00:37.641241+02
694	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 13:44:39.13116+03
697	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 19:51:04.59994+03
700	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:00:22.721726+03
703	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:02:00.147072+03
706	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:20:30.534969+03
502	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:36:04.657137+03
650	119	logged_in	\N	\N	\N	\N	\N	2020-10-16 21:47:22.654283+03
651	119	logged_in	\N	\N	\N	\N	\N	2020-10-16 21:47:34.716891+03
652	119	logged_in	\N	\N	\N	\N	\N	2020-10-16 21:47:46.416521+03
653	119	logged_in	\N	\N	\N	\N	\N	2020-10-16 21:48:19.095399+03
654	119	logged_in	\N	\N	\N	\N	\N	2020-10-16 21:49:35.29949+03
655	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:29:01.401737+03
656	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:29:07.827694+03
657	120	invalid_password	\N	\N	\N	\N	\N	2020-10-17 23:30:12.510179+03
658	120	invalid_password	\N	\N	\N	\N	\N	2020-10-17 23:30:17.077636+03
659	70	invalid_password	\N	\N	\N	\N	\N	2020-10-17 23:30:20.850646+03
660	70	invalid_password	\N	\N	\N	\N	\N	2020-10-17 23:30:23.97901+03
661	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:30:35.440272+03
662	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:30:37.530513+03
663	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:33.468971+03
664	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:39.910422+03
665	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:42.886399+03
666	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:44.855045+03
667	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:47.51836+03
668	119	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:31:47.789094+03
669	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:34:00.047032+03
670	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:34:02.736491+03
673	121	logged_in	\N	\N	\N	\N	\N	2020-10-17 23:56:44.798018+03
987	119	invalid_password	21	\N	66	\N	87.203.208.28/32	2021-03-13 20:09:05.047239+02
695	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 13:46:38.713115+03
698	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 19:57:41.923988+03
701	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:00:51.50143+03
704	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:02:22.053862+03
990	119	logged_in	\N	\N	66	\N	\N	2021-03-14 22:54:25.405554+02
997	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:03:47.640469+02
678	121	logged_in	\N	\N	\N	\N	\N	2020-10-18 00:00:03.458654+03
1004	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:12:28.926003+02
1007	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:19:25.665928+02
1014	119	logged_in	\N	\N	66	\N	\N	2021-03-15 18:44:27.327133+02
696	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 19:43:02.391564+03
699	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 19:59:32.059894+03
702	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:01:40.029956+03
705	119	logged_in	\N	\N	\N	\N	\N	2020-10-18 20:18:47.910427+03
1017	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:31:21.688606+02
1023	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:45:54.396256+02
511	75	invalid_password	\N	\N	\N	\N	\N	2020-06-17 13:31:00.766901+03
512	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:31:16.344964+03
513	71	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:32:29.220699+03
514	111	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:37:48.746544+03
515	112	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:47:15.441935+03
516	112	logged_in	\N	\N	\N	\N	\N	2020-06-17 16:48:03.227213+03
953	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:39:08.132729+02
958	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:42:44.548045+02
1029	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:57:44.890677+02
643	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 01:58:39.743713+03
644	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:46:17.328745+03
645	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:47:24.670627+03
646	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:48:06.444508+03
647	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:48:31.68282+03
648	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:50:04.338423+03
649	119	logged_in	\N	\N	\N	\N	\N	2020-07-23 15:51:07.537409+03
954	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:39:48.030063+02
968	119	logged_in	21	\N	66	\N	94.69.16.206/32	2021-03-09 13:23:39.871725+02
973	119	logged_in	\N	\N	66	\N	\N	2021-03-10 15:39:10.319794+02
975	119	logged_in	\N	\N	66	\N	\N	2021-03-11 10:16:07.345001+02
978	119	logged_in	\N	\N	66	\N	\N	2021-03-11 13:13:11.78809+02
986	119	logged_in	\N	\N	66	\N	\N	2021-03-12 09:04:12.149768+02
988	119	invalid_password	21	\N	66	\N	87.203.208.28/32	2021-03-13 20:09:17.767023+02
991	119	logged_in	\N	\N	66	\N	\N	2021-03-14 22:56:30.283951+02
998	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:04:58.502044+02
1005	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:13:06.947857+02
1008	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:24:23.201836+02
711	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:37:36.715647+02
712	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:37:52.786408+02
713	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:40:28.987769+02
714	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:41:17.56596+02
715	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:42:06.685095+02
716	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:42:30.629691+02
717	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:42:54.77951+02
718	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:43:28.937752+02
719	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:45:30.790067+02
720	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:46:52.993967+02
721	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:48:04.71672+02
722	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:51:49.619658+02
723	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 18:54:59.535158+02
724	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:10:36.609582+02
725	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:10:54.395649+02
726	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:11:28.511122+02
727	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:56:31.853215+02
728	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:56:43.54953+02
729	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 19:57:26.404479+02
730	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:03:41.247817+02
731	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:04:43.142257+02
732	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:17:55.015562+02
733	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:18:41.242064+02
734	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:19:21.813995+02
735	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:32:31.419492+02
736	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 20:36:07.857457+02
737	119	logged_in	\N	\N	\N	\N	127.0.0.1/32	2021-02-21 20:40:08.35802+02
738	119	logged_in	\N	\N	\N	\N	\N	2021-02-21 22:42:07.102089+02
739	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-21 23:03:30.691204+02
740	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-21 23:07:25.367605+02
741	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-21 23:39:33.595713+02
742	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 08:27:45.70906+02
743	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 08:37:12.861058+02
744	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 09:29:20.313234+02
745	119	logged_in	\N	\N	\N	\N	\N	2021-02-22 10:24:45.199036+02
746	119	logged_in	\N	\N	\N	\N	\N	2021-02-22 12:26:36.831689+02
747	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:07:21.564233+02
748	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:08:00.844091+02
749	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:12:33.961104+02
750	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:14:51.489131+02
751	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:15:26.364544+02
752	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:16:20.653156+02
753	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:40:30.404716+02
754	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:42:26.90226+02
755	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:44:20.536475+02
756	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:45:38.694732+02
757	119	logged_in	\N	\N	\N	\N	\N	2021-02-22 14:46:20.962444+02
758	119	logged_in	\N	\N	\N	\N	\N	2021-02-22 14:47:20.213763+02
759	119	logged_in	\N	\N	\N	\N	\N	2021-02-22 14:48:16.828576+02
760	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:49:59.871159+02
761	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:52:05.341113+02
762	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:53:18.547922+02
763	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:54:13.56269+02
764	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:04.367035+02
765	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:24.339029+02
766	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:55:55.02316+02
767	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:56:15.389804+02
768	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:57:23.059332+02
769	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:58:07.090575+02
770	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:59:10.192676+02
771	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 14:59:18.272342+02
772	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:02:39.55943+02
773	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:03:26.948412+02
774	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:07:47.255752+02
775	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:15:35.359511+02
776	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:16:45.861036+02
777	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-22 15:16:46.5425+02
778	119	logged_in	\N	\N	\N	\N	\N	2021-02-25 23:33:14.451955+02
779	119	logged_in	\N	\N	\N	\N	\N	2021-02-25 23:33:51.412228+02
780	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-25 23:36:08.484502+02
781	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 08:53:52.811832+02
782	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 10:01:38.304738+02
783	119	logged_in	\N	\N	\N	\N	\N	2021-02-26 10:16:19.75085+02
784	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 10:53:43.217028+02
785	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 11:28:21.9631+02
786	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 12:39:18.748681+02
787	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 12:40:34.565873+02
788	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 13:42:39.076136+02
789	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 14:43:06.416483+02
790	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 15:46:51.245638+02
791	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 21:52:08.383994+02
792	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 22:05:11.549543+02
793	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 23:31:16.394591+02
794	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-26 23:51:01.176005+02
795	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-27 00:54:32.086669+02
796	119	logged_in	\N	\N	\N	\N	87.203.202.178/32	2021-02-27 00:58:05.14509+02
797	119	logged_in	\N	\N	\N	\N	\N	2021-02-27 17:33:58.695893+02
798	119	logged_in	\N	\N	\N	\N	\N	2021-02-27 17:34:13.929149+02
799	119	logged_in	\N	\N	\N	\N	\N	2021-02-27 17:34:58.941133+02
800	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-02-27 17:47:35.800084+02
801	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-02-27 18:12:37.810035+02
802	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-02-27 21:22:45.503518+02
803	119	logged_in	\N	\N	\N	\N	\N	2021-02-28 20:08:17.514219+02
804	119	logged_in	\N	\N	\N	\N	\N	2021-02-28 21:36:10.524858+02
805	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-02-28 21:41:16.736165+02
806	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-02-28 22:54:09.125158+02
807	119	logged_in	\N	\N	\N	\N	\N	2021-02-28 23:43:29.503872+02
808	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 08:35:28.559718+02
809	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 08:47:43.09734+02
810	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 09:48:21.000044+02
1015	119	logged_in	\N	\N	66	\N	\N	2021-03-15 19:47:41.668667+02
811	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 10:53:14.171253+02
812	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 11:55:17.169186+02
813	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 13:39:00.815778+02
814	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 14:42:47.93444+02
815	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 20:40:14.660202+02
816	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 20:52:23.432165+02
817	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 21:31:34.826877+02
818	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 21:57:18.739063+02
819	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 22:22:01.066763+02
820	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 22:49:44.514958+02
821	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-01 22:49:50.195367+02
822	119	logged_in	\N	\N	\N	\N	\N	2021-03-01 23:12:38.38779+02
823	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 08:39:57.201218+02
824	119	logged_in	\N	\N	\N	\N	\N	2021-03-02 08:42:25.906018+02
825	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 09:00:56.007417+02
826	119	logged_in	\N	\N	\N	\N	\N	2021-03-02 09:13:32.751333+02
827	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 09:13:50.814484+02
828	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 09:31:54.423782+02
829	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 13:47:34.55096+02
830	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 17:47:01.63467+02
831	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 20:27:06.372913+02
832	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 20:27:17.084521+02
833	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 20:29:18.903612+02
834	119	logged_in	\N	\N	\N	\N	\N	2021-03-02 21:17:40.021673+02
835	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 21:19:52.269092+02
836	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-02 22:34:33.454762+02
837	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 10:27:35.063415+02
838	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 10:28:53.71531+02
839	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 10:36:53.379151+02
840	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 10:39:04.375496+02
841	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 11:41:24.291921+02
842	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 11:48:44.994512+02
843	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 11:48:53.166098+02
844	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 13:10:28.911996+02
845	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 13:42:26.706623+02
846	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 13:49:11.120019+02
847	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 14:42:01.478198+02
848	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 15:48:20.462747+02
849	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-03 20:51:19.949086+02
850	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 21:04:33.175017+02
851	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 21:13:15.425978+02
852	119	logged_in	\N	\N	\N	\N	\N	2021-03-03 21:15:06.771928+02
876	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:07:28.929531+02
877	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:08:10.35944+02
878	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:08:41.480586+02
879	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:10:26.139104+02
880	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:11:52.463266+02
881	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:12:33.798992+02
882	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:13:23.787272+02
883	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:14:30.740013+02
884	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:23:35.551913+02
885	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:35:14.184258+02
886	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:35:24.964742+02
887	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 09:37:43.780791+02
888	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 10:27:44.295547+02
889	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 10:28:00.527306+02
890	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 10:29:09.988938+02
891	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 10:29:46.744593+02
892	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:31:03.534947+02
893	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:45:59.203037+02
894	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:48:27.332046+02
895	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:49:25.138813+02
896	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:49:46.717729+02
897	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:50:16.969395+02
898	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 10:57:16.451083+02
899	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:01:13.921314+02
900	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:02:11.601596+02
901	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:03:44.455067+02
902	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:04:56.619348+02
903	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:06:45.987098+02
904	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:12:13.619986+02
905	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:16:18.777917+02
906	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 11:44:55.706611+02
907	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 14:46:32.776666+02
908	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 15:23:44.941464+02
909	119	logged_in	\N	\N	\N	\N	80.106.83.2/32	2021-03-04 15:23:56.944928+02
910	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:07:12.713279+02
911	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:07:47.591298+02
912	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:08:07.77243+02
913	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:08:29.00744+02
914	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:14:52.586752+02
915	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:15:02.885085+02
916	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:15:07.519362+02
917	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:34:10.34313+02
918	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:34:45.187165+02
919	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:35:51.938449+02
920	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:36:13.361651+02
921	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:36:17.342234+02
922	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:37:47.802955+02
923	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:38:19.140456+02
924	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:38:47.086027+02
925	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-04 16:47:59.77203+02
926	119	logged_in	\N	\N	\N	\N	\N	2021-03-04 16:51:03.884239+02
927	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-04 23:35:10.255213+02
928	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-05 08:45:08.809631+02
929	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-05 08:50:32.144235+02
930	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-05 09:36:51.278089+02
931	119	logged_in	\N	\N	\N	\N	87.203.201.94/32	2021-03-05 09:42:30.663265+02
932	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-05 11:27:41.44109+02
933	119	logged_in	\N	\N	\N	\N	\N	2021-03-05 15:34:56.315994+02
934	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-05 16:24:26.354092+02
935	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-05 16:32:51.863505+02
936	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 15:41:35.226014+02
937	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:04.910728+02
938	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:08.152744+02
939	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:11.01488+02
940	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:18:35.719872+02
941	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:09.6095+02
942	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:30.564079+02
943	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 17:19:49.109622+02
944	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 23:35:25.838651+02
945	119	invalid_password	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 23:49:37.836902+02
946	119	invalid_password	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 23:54:19.02811+02
947	119	invalid_password	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 23:54:52.023139+02
948	119	invalid_password	\N	\N	\N	\N	94.69.16.206/32	2021-03-06 23:55:18.1156+02
949	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-07 14:02:53.596333+02
950	119	logged_in	\N	\N	\N	\N	94.69.16.206/32	2021-03-07 14:03:07.403717+02
969	119	logged_in	\N	\N	66	\N	\N	2021-03-09 14:08:05.071801+02
955	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:40:59.545833+02
976	119	logged_in	\N	\N	66	\N	\N	2021-03-11 10:19:48.983747+02
979	119	logged_in	\N	\N	66	\N	\N	2021-03-11 14:58:02.986533+02
989	119	invalid_password	21	\N	66	\N	87.203.208.28/32	2021-03-13 20:09:34.431811+02
992	119	logged_in	\N	\N	66	\N	\N	2021-03-14 22:57:44.463355+02
999	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:07:40.995511+02
1006	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:19:29.148422+02
1009	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:26:15.057682+02
1016	119	logged_in	\N	\N	66	\N	\N	2021-03-15 20:02:51.835124+02
1018	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:34:15.912988+02
1024	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:47:00.448233+02
1030	119	logged_in	\N	\N	66	\N	\N	2021-03-16 11:02:48.101836+02
5	6	failed	\N	\N	\N	\N	172.17.41.8/32	2020-05-27 21:35:24.198331+03
956	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:41:51.402585+02
980	119	logged_in	\N	\N	66	\N	\N	2021-03-11 15:00:26.964208+02
993	119	logged_in	\N	\N	66	\N	\N	2021-03-14 22:59:01.552474+02
1000	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:08:35.629745+02
1010	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:27:19.197176+02
1019	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:40:50.269997+02
1025	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:50:18.723152+02
1031	119	logged_in	\N	\N	66	\N	\N	2021-03-16 11:05:57.309958+02
1035	119	logged_in	\N	\N	66	\N	\N	2021-03-16 17:44:08.696625+02
328	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:23:52.36626+03
329	55	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:35:47.811833+03
331	55	logged_in	\N	\N	\N	\N	\N	2020-06-09 22:39:54.446061+03
631	55	logged_in	\N	\N	\N	\N	\N	2020-06-25 23:16:59.8111+03
634	119	logged_in	\N	\N	\N	\N	\N	2020-06-26 18:50:14.010108+03
501	111	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:02:22.741051+03
503	111	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:36:23.289269+03
7	6	failed	\N	\N	\N	\N	172.17.41.9/32	2020-05-27 21:35:48.509607+03
334	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 23:15:45.905069+03
335	55	logged_in	\N	\N	\N	\N	\N	2020-06-10 11:18:28.106046+03
337	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 11:39:51.133747+03
339	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 16:32:59.104026+03
341	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 17:07:52.194678+03
342	69	logged_in	\N	\N	\N	\N	\N	2020-06-10 17:08:24.62317+03
344	55	logged_in	\N	\N	\N	\N	\N	2020-06-11 23:40:01.932906+03
345	69	logged_in	\N	\N	\N	\N	\N	2020-06-11 23:40:44.013276+03
347	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 00:03:50.942938+03
348	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 00:25:10.559997+03
349	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 00:44:26.834184+03
350	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 01:02:13.268625+03
354	55	logged_in	\N	\N	\N	\N	\N	2020-06-12 12:59:27.43542+03
427	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:15.358069+03
430	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:52.869098+03
431	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:15:59.362745+03
434	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:29:11.162592+03
437	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 14:35:21.334389+03
438	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 15:19:11.176587+03
441	55	logged_in	\N	\N	\N	\N	\N	2020-06-13 16:10:26.597911+03
448	69	logged_in	\N	\N	\N	\N	\N	2020-06-13 23:06:20.285097+03
483	69	logged_in	\N	\N	\N	\N	\N	2020-06-14 19:30:02.371282+03
499	69	logged_in	\N	\N	\N	\N	\N	2020-06-16 23:59:32.004781+03
500	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:00:09.885921+03
522	71	logged_in	\N	\N	\N	\N	\N	2020-06-17 20:23:07.413623+03
523	71	logged_in	\N	\N	\N	\N	\N	2020-06-17 20:24:09.596643+03
524	71	logged_in	\N	\N	\N	\N	\N	2020-06-17 20:32:43.566016+03
533	116	logged_in	\N	\N	\N	\N	\N	2020-06-18 18:58:48.409938+03
536	55	logged_in	\N	\N	\N	\N	\N	2020-06-19 20:17:22.189583+03
537	55	logged_in	\N	\N	\N	\N	\N	2020-06-19 20:35:47.699027+03
538	55	logged_in	\N	\N	\N	\N	\N	2020-06-19 20:53:42.394435+03
539	55	logged_in	\N	\N	\N	\N	\N	2020-06-19 21:11:57.406715+03
8	6	failed	\N	\N	\N	\N	172.17.41.9/32	2020-05-27 21:35:49.503475+03
313	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 20:38:51.719535+03
314	69	logged_in	\N	\N	\N	\N	\N	2020-06-08 20:39:12.498552+03
322	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:32:10.674421+03
323	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:34:36.579525+03
324	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:35:09.92852+03
326	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:54:25.582349+03
327	69	logged_in	\N	\N	\N	\N	\N	2020-06-09 21:55:14.147456+03
504	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:36:34.919981+03
505	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 00:37:40.514358+03
506	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:01:21.131454+03
507	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:12:41.268451+03
508	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:13:18.301834+03
509	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:19:54.090514+03
510	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 13:21:49.816959+03
6	6	failed	\N	\N	\N	\N	172.17.41.9/32	2020-05-27 21:35:46.141741+03
981	119	logged_in	\N	\N	66	\N	\N	2021-03-11 15:01:43.027965+02
994	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:00:32.588232+02
519	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 18:24:10.928348+03
957	119	logged_in	\N	\N	\N	\N	\N	2021-03-07 16:42:21.562877+02
1001	119	logged_in	\N	\N	66	\N	\N	2021-03-14 23:09:19.830866+02
1011	119	logged_in	\N	\N	66	\N	\N	2021-03-15 12:29:01.073226+02
1020	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:42:19.576883+02
1026	119	logged_in	\N	\N	66	\N	\N	2021-03-16 10:52:15.176475+02
1032	119	logged_in	\N	\N	66	\N	\N	2021-03-16 12:23:02.067037+02
517	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 17:09:10.509946+03
518	69	logged_in	\N	\N	\N	\N	\N	2020-06-17 17:11:22.868644+03
\.


--
-- Data for Name: oauth_api; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_api (id, name, url_hostname, is_active) FROM stdin;
1	#hashtag	127.0.0.1	t
2	#beach_bar	www.beachbar.com	t
\.


--
-- Data for Name: oauth_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_client (id, name, client_id, client_secret, description, logo_url, is_verified, is_active, updated_at, "timestamp", user_id, deleted_at) FROM stdin;
4	Test OAuth	52c3d5a192cf8e9630870eb9f372a93f983177257413eeece4a364d01cfc6b1b	51fb518c95ec57ced982018a5374d224b8085c3385a3bfa8d0c1164ed646618b	\N	\N	f	t	2020-06-03 16:01:21.639591+03	2020-05-24 12:59:13.614644+03	2	\N
9	Test OAuth app 2	537004c1c7d3cf76555fa834d60e8effb9727817949fc513683a9d0ca211e7c7	46f714562c528d1e03a6e0307da5d591c8d599df31b6489ca1626f88db37c7dd	\N	\N	f	f	2020-06-03 23:28:47.506315+03	2020-05-24 23:10:31.198516+03	2	\N
1	#hashtag	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5	70b387ce8d204b59d3068b426dcdb194d014e32a4124033430f3a1137bcfb55a	\N	\N	t	t	2020-06-14 21:32:42.807862+03	2020-05-23 23:49:08.429655+03	2	\N
2	#beach_bar	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f	3d0a0c7cab21ef2eadbed839c193f882aff9c7db9dce4cc94c77c17a840db403	\N	\N	t	t	2020-06-14 21:32:48.64066+03	2020-05-23 23:49:08.429655+03	2	\N
\.


--
-- Data for Name: oauth_client_origin_uri; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_client_origin_uri (id, value, client_id) FROM stdin;
8	http://localhost:5000/graphql	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5
9	https://www.beachbar.com/	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f
\.


--
-- Data for Name: oauth_client_redirect_uri; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_client_redirect_uri (id, value, client_id) FROM stdin;
15	http://localhost:5000/oauth/callback	9199701c143ef93c0de81e5e6dc48ffea614817c5e22b65b5a8134c37fa098a5
18	https://www.beachbar.com/oauth/hashtag/callback/	b4b136f3ec93ae2b5f1fa295ca0b301532ed780b3bb3607b16cfe473f19f743f
\.


--
-- Data for Name: oauth_client_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_client_scope (client_id, scope_id) FROM stdin;
2	1
2	2
2	3
2	4
2	7
2	8
2	9
2	13
2	16
2	18
2	20
2	21
2	22
2	23
2	24
2	26
2	28
2	31
2	30
2	33
2	36
2	37
2	32
2	34
2	35
2	38
2	45
2	83
2	90
2	91
2	93
2	94
2	86
2	87
2	88
2	125
2	126
\.


--
-- Data for Name: oauth_scope; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oauth_scope (id, name, api_id, description, public_id, public_use, deleted_at, updated_at, "timestamp") FROM stdin;
1	profile	1	Retrieve user’s basic profile info	75994755	t	\N	2020-06-14 15:49:20.937104+03	2020-06-14 15:49:20.937104+03
2	email	1	Retrieve user’s email address	59852119	t	\N	2020-06-14 15:49:43.747211+03	2020-06-14 15:49:43.747211+03
3	openid	1	Authenticate using OpenID Connect, by returning the ‘sub’ claim in the auth token	83963827	t	\N	2020-06-14 15:50:07.807137+03	2020-06-14 15:50:07.807137+03
4	hashtag@crud:user	1	Create, read, update & delete a user	28856371	f	\N	2020-06-14 15:51:18.551402+03	2020-06-14 15:51:18.551402+03
7	hashtag@delete:user_account	1	Delete a user’s account	35225587	t	\N	2020-06-14 16:00:28.377163+03	2020-06-14 16:00:28.377163+03
8	hashtag@crud:oauth_client	1	Create, read, update & delete an OAuth Client application	52144749	f	\N	2020-06-14 16:01:19.05796+03	2020-06-14 16:01:19.05796+03
9	hashtag@read:oauth_client	1	Read an OAuth’s Client application info	51658063	t	\N	2020-06-14 16:02:39.352673+03	2020-06-14 16:02:39.352673+03
13	beach_bar@crud:user	2	Create, read, update & delete a user	28098639	f	\N	2020-06-14 16:08:44.297301+03	2020-06-14 16:08:44.297301+03
16	beach_bar@crud:beach_bar	2	Create, read, update & delete a #beach_bar	17707009	f	\N	2020-06-14 16:10:37.600415+03	2020-06-14 16:10:37.600415+03
20	beach_bar@crud:service_beach_bar	2	Create (assign), read, update & delete (remove) a feature (service) from a #beach_bar	96517701	f	\N	2020-06-14 16:14:23.087862+03	2020-06-14 16:14:23.087862+03
21	beach_bar@crud:owner_beach_bar	2	Create (assign) & delete (remove) an owner of a #beach_bar. Update operation does not exist	64655246	f	\N	2020-06-14 16:15:09.068191+03	2020-06-14 16:15:09.068191+03
23	beach_bar@crud:review_answer	2	Create, update & delete an answer, from one of the owners of a #beach_bar, of a review	54798507	f	\N	2020-06-14 16:17:00.634282+03	2020-06-14 16:17:00.634282+03
24	beach_bar@crud:beach_bar_restaurant	2	Create, update & delete a restaurant for a #beach_bar	18097474	f	\N	2020-06-14 16:17:39.007007+03	2020-06-14 16:17:39.007007+03
26	beach_bar@update:beach_bar_restaurant	2	Update a restaurant’s info of a #beach_bar	74463840	f	\N	2020-06-14 16:18:55.599558+03	2020-06-14 16:18:55.599558+03
28	beach_bar@read:user	2	Read a user’s profile info	27641585	t	\N	2020-06-14 16:29:30.776428+03	2020-06-14 16:29:30.776428+03
22	beach_bar@crud:user_review	2	Create, update & delete a review of a #beach_bar	21091595	f	\N	2020-06-14 16:16:18.031736+03	2020-06-14 16:16:18.031736+03
30	beach_bar@read:user_review	2	Read a user’s reviews	50262111	t	\N	2020-06-15 22:25:38.407237+03	2020-06-15 22:25:38.407237+03
31	beach_bar@read:user_account	2	Read a user’s profile with extended info	92950791	t	\N	2020-06-15 22:31:24.960904+03	2020-06-15 22:31:24.960904+03
33	beach_bar@read:user_account:person_title	2	Read a user’s honorific title	51931817	t	\N	2020-06-15 22:46:26.84662+03	2020-06-15 22:46:26.84662+03
36	beach_bar@read:user_account:address	2	Read a user’s address	63429628	t	\N	2020-06-16 13:20:34.946696+03	2020-06-16 13:20:34.946696+03
37	beach_bar@read:user_account:zip_code	2	Read a user’s zip code	98726054	t	\N	2020-06-16 13:21:00.455026+03	2020-06-16 13:21:00.455026+03
32	hashtag@read:user_account:birthday_and_age	2	Read a user’s birthday and age	15336789	t	\N	2020-06-15 22:46:03.245833+03	2020-06-15 22:46:03.245833+03
34	hashtag@read:user_account:country	2	Read a user’s country	18959141	t	\N	2020-06-16 13:19:18.433357+03	2020-06-16 13:19:18.433357+03
35	hashtag@read:user_account:city	2	Read a user’s city or hometown	87508880	t	\N	2020-06-16 13:19:40.729201+03	2020-06-16 13:19:40.729201+03
38	hashtag@read:user	1	Read a user’s basic profile info	67143090	t	\N	2020-06-17 11:47:10.131334+03	2020-06-17 11:47:10.131334+03
42	beach_bar@create:owner_beach_bar	2	Create (assign) a user, as an owner, to a #beach_bar	82566739	f	\N	2020-06-17 23:48:47.234131+03	2020-06-17 23:48:47.234131+03
43	beach_bar@update:owner_beach_bar	2	Update an owner of a #beach_bar. For example, making it a primary owner	41340048	f	\N	2020-06-17 23:49:57.392859+03	2020-06-17 23:49:57.392859+03
44	beach_bar@delete:owner_beach_bar	2	Delete (remove) an owner from a #beach_bar	64926248	f	\N	2020-06-17 23:50:28.652108+03	2020-06-17 23:50:28.652108+03
45	beach_bar@update:beach_bar_feature:description	2	Update the description of a feature (service) a #beach_bar provides	51204658	f	\N	2020-06-19 16:18:03.699718+03	2020-06-19 16:18:03.699718+03
78	beach_bar@crud:restaurant_food_item	2	Create, update & delete (remove) a food item from a #beach_bar restaurant	78429083	f	\N	2020-06-21 23:33:40.419331+03	2020-06-21 23:33:40.419331+03
83	beach_bar@crud:product	2	Create, update & delete a product from a #beach_bar	79855798	f	\N	2020-06-21 23:39:05.846397+03	2020-06-21 23:39:05.846397+03
90	beach_bar@crud:beach_bar_entry_fee	2	Create, read, update & delete an entry fee from a #beach_bar	97124888	f	\N	2020-06-25 12:09:05.299757+03	2020-06-25 12:09:05.299757+03
84	beach_bar@update:product	2	Update a product info of a #beach_bar. A user with this scope cannot update the product price	54525395	f	\N	2020-06-21 23:39:21.724505+03	2020-06-21 23:39:21.724505+03
18	beach_bar@update:beach_bar	2	Update a #beach_bar details. Someone with this scope cannot update the status of the #beach_bar	68627780	f	\N	2020-06-14 16:12:50.887105+03	2020-06-14 16:12:50.887105+03
81	beach_bar@update:restaurant_food_item	2	Update a food item from a #beach_bar restaurant. Someone with that scope cannot modify the product price	63133027	f	\N	2020-06-21 23:34:30.152906+03	2020-06-21 23:34:30.152906+03
91	beach_bar@update:beach_bar_entry_fee	2	Update an entry fee for a #beach_bar. Someone with this scope can update the price value of  the fee too	60203762	f	\N	2020-06-25 12:10:01.052057+03	2020-06-25 12:10:01.052057+03
93	beach_bar@crud:product_reservation_limit	2	Create, update & delete a reservation limit of a #beach_bar product	74549417	f	\N	2020-07-03 00:00:42.055116+03	2020-07-03 00:00:42.055116+03
94	beach_bar@update:product_reservation_limit	2	Update a reservation limit of a #beach_bar product. Someone with this scope can update the price value of  the fee too	52783536	f	\N	2020-07-03 00:01:11.076817+03	2020-07-03 00:01:11.076817+03
87	beach_bar@update:coupon_code	2	Update a coupon’s code details	60588348	f	\N	2020-06-21 23:44:27.561721+03	2020-06-21 23:44:27.561721+03
86	beach_bar@crud:coupon_code	2	Create, update & delete a coupon code	23552940	f	\N	2020-06-21 23:44:09.438809+03	2020-06-21 23:44:09.438809+03
88	beach_bar@crud:offer_campaign	2	Create, update & delete an offer campaign. Someone with this scope can also issue new offer codes for the campaign	53542335	f	\N	2020-06-21 23:44:42.478132+03	2020-06-21 23:44:42.478132+03
125	beach_bar@crud:beach_bar_img_url	2	Create, update & delete an image from a #beach_bar	22068414	f	\N	2020-07-30 15:47:27.292794+03	2020-07-30 15:47:27.292794+03
89	beach_bar@update:offer_campaign	2	Update an offer campaign details	33395350	f	\N	2020-06-21 23:44:56.307876+03	2020-06-21 23:44:56.307876+03
126	beach_bar@update:beach_bar_img_url	2	Update the details of an image of a #beach_bar	74708235	f	\N	2020-07-30 15:47:49.749417+03	2020-07-30 15:47:49.749417+03
29	beach_bar@read:user_account:phone_number	2	Read  a user’s contact details	75965383	t	\N	2020-06-15 22:23:33.217132+03	2020-06-15 22:23:33.217132+03
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, first_name, last_name, token_version, forgot_password_locked, country_id, updated_at, "timestamp", picture_url, deleted_at, city_id, birthday, age) FROM stdin;
5	me@gmail.com	$2a$12$OFQFDWMWlB4VETY.8WnaqemcwjOMlyy8UnlvvJZlwDgfPR55ZBTdq	\N	\N	0	f	\N	2020-05-30 00:30:02.326063+03	2020-05-30 00:30:02.326063+03	\N	\N	\N	\N	\N
7	aggeloskraxt@gmail.com	$2a$12$qtqEZOdDtXUUOnf/4g0Sq.R6w0PAaxKVjOJ7Los2zCpfiiTfF38lO	\N	\N	0	f	\N	2020-05-30 00:33:04.13106+03	2020-05-30 00:33:04.13106+03	\N	\N	\N	\N	\N
6	hey@gmail.com	$2a$12$CSHBlOSUmoCZO3REEi7LA.tONCs94QIpEhSLBeeAYZLAEcq5J8f42	skg	Hey	0	f	\N	2021-03-07 16:54:16.747004+02	2020-05-30 00:32:50.339841+03	\N	\N	\N	\N	\N
82	samos@gmail.com	$2a$12$6I.O0YHBvfGcug3jOBqocOAsszjw7UiWPd5n2k/pLbZbEKlwBLR9G	\N	\N	0	f	\N	2020-06-24 16:34:19.527521+03	2020-06-24 16:34:19.527521+03	\N	\N	\N	\N	\N
83	art@gmail.com	$2a$12$qX6ujLkUze0ajuQbILzZleIbhocNHZ.mOvu6fIB95u6lrigXMNaDC	\N	\N	0	f	\N	2020-06-24 17:36:59.563059+03	2020-06-24 17:36:59.563059+03	\N	\N	\N	\N	\N
4	skg@gmail.com	$2a$12$8.DeRk6BSWV10UxOJfZo6.rhhnLmOpHi6rcvkg/.Pa99ZjzkV7UPO	\N	\N	0	f	\N	2020-06-02 15:06:22.791816+03	2020-05-30 00:24:21.119065+03	\N	\N	\N	\N	\N
40	ath@gmail.com	$2a$12$VHc7kq0KjN58oWm2sixJy.saBDDu3HVfkm6W4vHJ/lAIL4itXu9IO	\N	\N	0	f	\N	2020-06-05 23:49:13.225596+03	2020-06-03 15:32:37.481532+03	\N	2020-06-05 23:49:13.225596+03	\N	\N	\N
84	georgekraxt@gmail.com	$2a$12$4oPczH67ftwNYvMvBacqN.PS5IApBoWB0nKIAGlmNovQo3DN4d5hK	George	Krachtopoul	11	f	7	2021-03-15 12:30:31.336971+02	2020-06-25 23:59:06.577098+03	https://user-account-images.s3.amazonaws.com/mPRE_tBZxiPN_me.jpg	\N	\N	2004-01-10	17
2	georgekraxt@gmail.com	$2a$12$dBWh3fhVpxvJOFhZjTh7heWFp7BC0wnC2XwtnxgN/JFwhBAiV0kKi	Georgios	Krachtopoulos	17	f	\N	2021-03-07 16:54:16.747004+02	2020-05-23 23:49:01.133602+03	\N	2020-06-25 23:17:22.316293+03	\N	2009-09-10	10
85	georgekrax@gmail.com	$2a$12$SkWmha7ef457otpymF3CZuyhQseCrSvKw3NoTLhNjJMWq/PZBXiUm	\N	\N	0	f	\N	2020-10-17 23:33:50.65985+03	2020-10-17 23:33:50.65985+03	\N	\N	\N	\N	\N
46	hbh@gmail.com	$2a$12$LO885mbNqEfmaFHZhZu.wOoNpg5bGHOk7MHtmOWx5/61f1O1O3S9C	\N	\N	0	f	\N	2020-06-14 00:33:55.91134+03	2020-06-14 00:33:55.91134+03	\N	\N	\N	\N	\N
41	kraxt@gmail.com	$2a$12$sHX.qXUX6BnZgstFYLI27eixRu.HFocXHTrMJlxKGQCuem6bjgznq	\N	\N	0	f	\N	2020-06-08 21:09:27.669529+03	2020-06-08 21:09:27.669529+03	\N	\N	\N	\N	\N
47	london@gmail.com	$2a$12$EEgIehpezBom8.8jaz//6uBe9yIgk4EoYDtxbPeImRagOZvE7NtlC	\N	\N	0	f	\N	2020-06-14 00:40:00.064434+03	2020-06-14 00:40:00.064434+03	\N	\N	\N	\N	\N
80	ams@gmail.com	$2a$12$EE.KtqzNrcFqG74xgG4KPudX5FbYr1/zmYYFNhOuY7sP0HPfT8RwS	\N	\N	0	f	\N	2020-06-14 21:32:52.709207+03	2020-06-14 21:32:52.709207+03	\N	\N	\N	\N	\N
81	amsterdam@gmail.com	$2a$12$SsZTvC0F774u8dXDKlqUIezUvXexs.MflcD7skPZSam5PC87Knhyu	\N	\N	0	f	\N	2020-06-14 21:39:55.973746+03	2020-06-14 21:39:55.973746+03	\N	\N	\N	\N	\N
43	makis@gmail.com	$2a$12$SH/5eFxvNweIOhhjfN8jC.6.abkukd012Msz1rz8tmy.oWxTNvqXO	\N	\N	0	f	\N	2020-06-10 17:33:21.15995+03	2020-06-10 17:33:21.15995+03	\N	\N	\N	\N	\N
44	oliver@gmail.com	$2a$12$I9aXTHBx9JPOIkVSm1fNV.HNPBpGLhUIhX.HFgGs05XoYYLBtoqvm	\N	\N	0	f	\N	2020-06-10 17:34:24.303661+03	2020-06-10 17:34:24.303661+03	\N	\N	\N	\N	\N
45	mama@gmail.com	$2a$12$jebzQiUvzyv1p4LMcdLJ7.Awalu4d0rELEEWVwInjDRLrkQkrKB42	\N	\N	0	f	\N	2020-06-10 17:38:11.562092+03	2020-06-10 17:38:11.562092+03	\N	\N	\N	\N	\N
42	ath@gmail.com	$2a$12$DelgXjbf6VBdkIJKt1DibeGPPlJzEeavaRMEsxffc442wyszVUaQy	\N	\N	0	f	\N	2021-03-07 16:54:16.747004+02	2020-06-08 22:26:14.069543+03	\N	2020-06-17 20:32:55.602983+03	\N	\N	\N
86	aggeloskrachtopoulos@gmail.com	$2a$12$YdG.nchkmuxTVXQzm0SMguajjd9qNiwil2zl95PFRCD521liLLD1.	\N	\N	0	f	\N	2021-03-07 00:41:36.481264+02	2021-03-07 00:41:36.481264+02	\N	\N	\N	\N	\N
87	mhia@gmail.com	$2a$12$y5h6NFo5UTr3Fl2cX8/VLeLu6QGvqqJavWUjJKWOK.vwz3mB/5A.i	\N	\N	0	f	\N	2021-03-07 00:44:42.052851+02	2021-03-07 00:44:42.052851+02	\N	\N	\N	\N	\N
88	kgt@gmail.com	$2a$12$j18UUNL438tZyioqLSlf9.MdYozlJrc5YgsSVwqn6iBhdlRHvjf32	\N	\N	0	f	\N	2021-03-07 00:45:51.710068+02	2021-03-07 00:45:51.710068+02	\N	\N	\N	\N	\N
89	effsdf@gmail.com	$2a$12$ogb8Qt6DDF8boec8bkzpOOv2SLNudd/B8E0Wkb69r/AEpt76z/Ua.	\N	\N	0	f	\N	2021-03-07 00:52:01.184079+02	2021-03-07 00:52:01.184079+02	\N	\N	\N	\N	\N
90	skg20178@gmail.com	$2a$12$9ZS4ACbtymwb/1mt3WP1ueiUj9OdBUcJtqa/O8qlmet8iIgDp1v2u	\N	\N	0	f	\N	2021-03-07 00:53:40.378809+02	2021-03-07 00:53:40.378809+02	\N	\N	\N	\N	\N
91	edssad@gmail.com	$2a$12$HS3Cpjt10B3hsfWneXwKiecRCs9oi7KkIYMLbaA.8BI1sBFZvlsAG	\N	\N	0	f	\N	2021-03-07 01:02:40.129378+02	2021-03-07 01:02:40.129378+02	\N	\N	\N	\N	\N
92	ekjkdd@gmail.com	$2a$12$KpdZ4JLUNUBt7KwS/8AxnewmPeuCjkTrp7UQrrbCTgCisRqabSM0W	\N	\N	0	f	\N	2021-03-07 01:03:14.827723+02	2021-03-07 01:03:14.827723+02	\N	\N	\N	\N	\N
\.


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_id_seq', 128, true);


--
-- Name: city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.city_id_seq', 4, true);


--
-- Name: client_browser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_browser_id_seq', 144, true);


--
-- Name: client_os_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_os_id_seq', 1, true);


--
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.country_id_seq', 76, false);


--
-- Name: login_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.login_details_id_seq', 1035, true);


--
-- Name: oauth_api_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_api_id_seq', 3, true);


--
-- Name: oauth_client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_client_id_seq', 11, true);


--
-- Name: oauth_client_origin_uri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_client_origin_uri_id_seq', 9, true);


--
-- Name: oauth_client_redirect_uri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_client_redirect_uri_id_seq', 18, true);


--
-- Name: oauth_scope_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oauth_scope_id_seq', 127, true);


--
-- Name: platform_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.platform_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 92, true);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


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
-- Name: login_details login_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_pkey PRIMARY KEY (id);


--
-- Name: oauth_api oauth_api_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_api
    ADD CONSTRAINT oauth_api_name_key UNIQUE (name);


--
-- Name: oauth_api oauth_api_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_api
    ADD CONSTRAINT oauth_api_pkey PRIMARY KEY (id);


--
-- Name: oauth_api oauth_api_url_hostname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_api
    ADD CONSTRAINT oauth_api_url_hostname_key UNIQUE (url_hostname);


--
-- Name: oauth_client oauth_client_client_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client
    ADD CONSTRAINT oauth_client_client_id_key UNIQUE (client_id);


--
-- Name: oauth_client oauth_client_client_secret_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client
    ADD CONSTRAINT oauth_client_client_secret_key UNIQUE (client_secret);


--
-- Name: oauth_client_origin_uri oauth_client_origin_uri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_origin_uri
    ADD CONSTRAINT oauth_client_origin_uri_pkey PRIMARY KEY (id);


--
-- Name: oauth_client oauth_client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client
    ADD CONSTRAINT oauth_client_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_redirect_uri oauth_client_redirect_uri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_redirect_uri
    ADD CONSTRAINT oauth_client_redirect_uri_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_scope oauth_client_scope_client_id_scope_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_scope
    ADD CONSTRAINT oauth_client_scope_client_id_scope_id_key UNIQUE (client_id, scope_id);


--
-- Name: oauth_scope oauth_scope_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_scope
    ADD CONSTRAINT oauth_scope_pkey PRIMARY KEY (id);


--
-- Name: oauth_scope oauth_scope_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_scope
    ADD CONSTRAINT oauth_scope_value_key UNIQUE (name);


--
-- Name: hashtag_community_platform platform_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtag_community_platform
    ADD CONSTRAINT platform_pkey PRIMARY KEY (id);


--
-- Name: hashtag_community_platform platform_unique_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtag_community_platform
    ADD CONSTRAINT platform_unique_name UNIQUE (name);


--
-- Name: hashtag_community_platform platform_url_hostname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hashtag_community_platform
    ADD CONSTRAINT platform_url_hostname_key UNIQUE (url_hostname);


--
-- Name: oauth_scope unique_public_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_scope
    ADD CONSTRAINT unique_public_id UNIQUE (public_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: account_user_client_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX account_user_client_unique ON public.account USING btree (user_id, client_id) WHERE (deleted_at IS NULL);


--
-- Name: user_unique_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_unique_email ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: oauth_client updated_at_modified_oauth_client_column; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_at_modified_oauth_client_column BEFORE UPDATE ON public.oauth_client FOR EACH ROW EXECUTE FUNCTION public.trigger_update_modified_column();


--
-- Name: user updated_at_modified_user_column; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER updated_at_modified_user_column BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.trigger_update_modified_column();


--
-- Name: account account_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_client(client_id);


--
-- Name: account account_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: login_details login_details_browser_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_browser_id_fkey FOREIGN KEY (browser_id) REFERENCES public.client_browser(id) ON DELETE SET NULL;


--
-- Name: login_details login_details_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id) ON DELETE SET NULL;


--
-- Name: login_details login_details_os_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_details
    ADD CONSTRAINT login_details_os_id_fkey FOREIGN KEY (os_id) REFERENCES public.client_os(id) ON DELETE SET NULL;


--
-- Name: oauth_client_origin_uri oauth_client_origin_uri_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_origin_uri
    ADD CONSTRAINT oauth_client_origin_uri_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_client(client_id) ON DELETE CASCADE;


--
-- Name: oauth_client_redirect_uri oauth_client_redirect_uri_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_redirect_uri
    ADD CONSTRAINT oauth_client_redirect_uri_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_client(client_id) ON DELETE CASCADE;


--
-- Name: oauth_client_scope oauth_client_scope_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_scope
    ADD CONSTRAINT oauth_client_scope_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oauth_client(id) ON DELETE CASCADE;


--
-- Name: oauth_client_scope oauth_client_scope_scope_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client_scope
    ADD CONSTRAINT oauth_client_scope_scope_id_fkey FOREIGN KEY (scope_id) REFERENCES public.oauth_scope(id) ON DELETE CASCADE;


--
-- Name: oauth_client oauth_client_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_client
    ADD CONSTRAINT oauth_client_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: oauth_scope oauth_scope_api_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oauth_scope
    ADD CONSTRAINT oauth_scope_api_id_fkey FOREIGN KEY (api_id) REFERENCES public.oauth_api(id) ON DELETE CASCADE;


--
-- Name: user user_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.city(id);


--
-- PostgreSQL database dump complete
--

