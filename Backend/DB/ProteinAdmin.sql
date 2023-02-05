--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying(20)
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: daily_nutrition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_nutrition (
    id bigint NOT NULL,
    date date,
    email character varying(50),
    calories real,
    protein real,
    description character varying(50),
    weight real,
    committed boolean
);


ALTER TABLE public.daily_nutrition OWNER TO postgres;

--
-- Name: daily_nutrition_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_nutrition_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.daily_nutrition_id_seq OWNER TO postgres;

--
-- Name: daily_nutrition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_nutrition_id_seq OWNED BY public.daily_nutrition.id;


--
-- Name: sequential_nums; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sequential_nums
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sequential_nums OWNER TO postgres;

--
-- Name: nutritional_time_series; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nutritional_time_series (
    date date,
    calories real,
    protein real,
    email character varying(30),
    id integer DEFAULT nextval('public.sequential_nums'::regclass)
);


ALTER TABLE public.nutritional_time_series OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: subcategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategory (
    id integer NOT NULL,
    name character varying(20),
    category_id integer
);


ALTER TABLE public.subcategory OWNER TO postgres;

--
-- Name: subcategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subcategory_id_seq OWNER TO postgres;

--
-- Name: subcategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategory_id_seq OWNED BY public.subcategory.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: georgi
--

CREATE TABLE public."user" (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    weight real,
    weightsystem text,
    height real,
    heightsystem text,
    activitylevel text,
    dob date,
    goal character varying(20),
    gender character varying(20),
    admin boolean
);


ALTER TABLE public."user" OWNER TO georgi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: georgi
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO georgi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: georgi
--

ALTER SEQUENCE public.users_id_seq OWNED BY public."user".id;


--
-- Name: value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.value (
    id integer NOT NULL,
    calories numeric,
    protein numeric
);


ALTER TABLE public.value OWNER TO postgres;

--
-- Name: value_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.value_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.value_id_seq OWNER TO postgres;

--
-- Name: value_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.value_id_seq OWNED BY public.value.id;


--
-- Name: variation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variation (
    id integer NOT NULL,
    type character varying(50),
    brand character varying(50),
    subcategory_id integer,
    value_id integer
);


ALTER TABLE public.variation OWNER TO postgres;

--
-- Name: variation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.variation_id_seq OWNER TO postgres;

--
-- Name: variation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variation_id_seq OWNED BY public.variation.id;


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: daily_nutrition id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_nutrition ALTER COLUMN id SET DEFAULT nextval('public.daily_nutrition_id_seq'::regclass);


--
-- Name: subcategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategory ALTER COLUMN id SET DEFAULT nextval('public.subcategory_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: georgi
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: value id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.value ALTER COLUMN id SET DEFAULT nextval('public.value_id_seq'::regclass);


--
-- Name: variation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation ALTER COLUMN id SET DEFAULT nextval('public.variation_id_seq'::regclass);


--
-- Name: category categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: daily_nutrition daily_nutrition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_nutrition
    ADD CONSTRAINT daily_nutrition_pkey PRIMARY KEY (id);


--
-- Name: nutritional_time_series nutritional_time_series_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutritional_time_series
    ADD CONSTRAINT nutritional_time_series_id_key UNIQUE (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: subcategory subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategory
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (id);


--
-- Name: value unique_calories_protein; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.value
    ADD CONSTRAINT unique_calories_protein UNIQUE (calories, protein);


--
-- Name: nutritional_time_series unique_date_email_nts; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutritional_time_series
    ADD CONSTRAINT unique_date_email_nts UNIQUE (date, email);


--
-- Name: variation unique_type_brand; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT unique_type_brand UNIQUE (type, brand);


--
-- Name: user users_email_key; Type: CONSTRAINT; Schema: public; Owner: georgi
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: user users_pkey; Type: CONSTRAINT; Schema: public; Owner: georgi
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: value values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.value
    ADD CONSTRAINT values_pkey PRIMARY KEY (id);


--
-- Name: variation variations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variations_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: daily_nutrition f_key_email; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_nutrition
    ADD CONSTRAINT f_key_email FOREIGN KEY (email) REFERENCES public."user"(email);


--
-- Name: nutritional_time_series nutritional_time_series_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutritional_time_series
    ADD CONSTRAINT nutritional_time_series_email_fkey FOREIGN KEY (email) REFERENCES public."user"(email);


--
-- Name: subcategory subcategories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategory
    ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id);


--
-- Name: variation variations_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variations_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategory(id);


--
-- Name: variation variations_value_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variation
    ADD CONSTRAINT variations_value_id_fkey FOREIGN KEY (value_id) REFERENCES public.value(id);


--
-- Name: TABLE category; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.category TO georgi;


--
-- Name: SEQUENCE category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.category_id_seq TO georgi;


--
-- Name: TABLE daily_nutrition; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.daily_nutrition TO georgi;


--
-- Name: SEQUENCE daily_nutrition_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.daily_nutrition_id_seq TO georgi;


--
-- Name: SEQUENCE sequential_nums; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.sequential_nums TO georgi;


--
-- Name: TABLE nutritional_time_series; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nutritional_time_series TO georgi;


--
-- Name: TABLE session; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.session TO georgi;


--
-- Name: TABLE subcategory; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.subcategory TO georgi;


--
-- Name: SEQUENCE subcategory_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.subcategory_id_seq TO georgi;


--
-- Name: TABLE value; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.value TO georgi;


--
-- Name: SEQUENCE value_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.value_id_seq TO georgi;


--
-- Name: TABLE variation; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.variation TO georgi;


--
-- Name: SEQUENCE variation_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.variation_id_seq TO georgi;


--
-- PostgreSQL database dump complete
--

