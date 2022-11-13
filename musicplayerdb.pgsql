--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Homebrew)
-- Dumped by pg_dump version 14.5 (Homebrew)

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
-- Name: musicplayerdb; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE musicplayerdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE musicplayerdb OWNER TO "postgres";

\connect musicplayerdb

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: album; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.album (
    album_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    artist_fk uuid NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    release_date date NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.album OWNER TO "postgres";

--
-- Name: artist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist (
    artist_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    aka character varying(100) NOT NULL,
    description text NOT NULL,
    birth_day date NOT NULL,
    birth_place character varying(100) NOT NULL,
    profile_pic bytea,
    label_fk uuid,
    gender_fk uuid,
    created_by uuid NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.artist OWNER TO "postgres";

--
-- Name: gender; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender (
    gender_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    is_active boolean DEFAULT true
);


ALTER TABLE public.gender OWNER TO "postgres";

--
-- Name: music_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.music_label (
    label_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    is_active boolean DEFAULT true
);


ALTER TABLE public.music_label OWNER TO "postgres";

--
-- Name: song; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.song (
    song_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    album_fk uuid,
    title character varying(100) NOT NULL,
    gender_fk uuid NOT NULL,
    file bytea NOT NULL,
    is_single boolean NOT NULL,
    feature uuid[],
    is_active boolean DEFAULT true
);


ALTER TABLE public.song OWNER TO "postgres";

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(250) NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_admin boolean DEFAULT false,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO "postgres";

--
-- Data for Name: album; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.album (album_id, artist_fk, name, description, release_date, is_active) FROM stdin;
\.


--
-- Data for Name: artist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist (artist_id, name, aka, description, birth_day, birth_place, profile_pic, label_fk, gender_fk, created_by, is_active) FROM stdin;
1abbf19f-c14b-4542-a391-17c33e42df9a	Emmanuel Gasmey	Anuel AA	 Anuel Doble AA	1992-11-26	Carolina, Purto Rico	\\x	1d72914b-09db-4af5-a6ed-8f41123dda51	707d7b48-340f-4d41-ad98-eef361d84db4	c54616d1-07c9-4ce5-8d05-c42e3ebb0350	t
d1306795-036a-476c-9f6e-8725abc40ce4	Emmanuel Gasmey	Anuel AA	 Anuel Doble AA	1992-11-26	Carolina, Purto Rico	\\x	1d72914b-09db-4af5-a6ed-8f41123dda51	707d7b48-340f-4d41-ad98-eef361d84db4	c54616d1-07c9-4ce5-8d05-c42e3ebb0350	t
d29b8c52-c782-48ba-b441-abf45781228b	Austin Santos	Arcangel	Arcangel, la maravilla	1992-11-26	Carolina, Purto Rico	\\x	9bc81ab2-47b4-4dd4-9861-287027835cfa	707d7b48-340f-4d41-ad98-eef361d84db4	c54616d1-07c9-4ce5-8d05-c42e3ebb0350	t
\.


--
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (gender_id, name, description, is_active) FROM stdin;
707d7b48-340f-4d41-ad98-eef361d84db4	Reggaetón	El reguetón4 es un género musical5 que derivó del reggae en español que es a su vez un subgénero del dancehall, así como elementos principalmente de la música bounce. Es un género musical muy popular hasta hoy en día; que ha llegado a alcanzar sus apogeos máximos durante las décadas del 2000 y 2010.	t
fd63d9a0-0d21-40d6-a9c8-dc4f96117421	DanceHall	DanceHall es una mierda	t
\.


--
-- Data for Name: music_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.music_label (label_id, name, description, is_active) FROM stdin;
9bc81ab2-47b4-4dd4-9861-287027835cfa	Pina Records	Pina Records Company	t
bc1cced4-4c4f-4f54-aab9-aa3af4cb70e2	Universal Music	Universal Music Inc.	t
1d72914b-09db-4af5-a6ed-8f41123dda51	Sony Music	Sony Music Inc.	t
\.


--
-- Data for Name: song; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.song (song_id, album_fk, title, gender_fk, file, is_single, feature, is_active) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password, name, created_at, is_admin, is_active) FROM stdin;
c54616d1-07c9-4ce5-8d05-c42e3ebb0350	prueba@gmail.com	$2b$10$YJPV4mFa6uSDdwrqK1M0uucBubtcDnSFfzJ25Cv.e5DRHnvW7BCRS	Usuario Prueba	2022-11-04 23:41:48.91958	t	t
68fa1a17-8a36-4c8b-963b-872463ade1aa	cris@gmail.com	$2b$10$e6Mh6UNyiCuZof4wE.nd4.ty.8unZN9U2ZtprlVitZoret4mPU8OO	Cristiano Ronaldo	2022-11-06 23:51:16.849649	f	t
db657660-351b-4593-940d-07c08126a66b	admin@gmail.com	$2b$10$xHuBMAIcyGG2rTtcgDxNluh.RUpw/di1xNaYiT/LWt6LUB2gmSJ2y	Admin	2022-11-07 10:40:30.019061	t	t
\.


--
-- Name: album album_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album
    ADD CONSTRAINT album_pkey PRIMARY KEY (album_id);


--
-- Name: artist artist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT artist_pkey PRIMARY KEY (artist_id);


--
-- Name: gender gender_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (gender_id);


--
-- Name: music_label music_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.music_label
    ADD CONSTRAINT music_label_pkey PRIMARY KEY (label_id);


--
-- Name: song song_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: song fk_album; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT fk_album FOREIGN KEY (album_fk) REFERENCES public.album(album_id);


--
-- Name: album fk_artist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album
    ADD CONSTRAINT fk_artist FOREIGN KEY (artist_fk) REFERENCES public.artist(artist_id);


--
-- Name: artist fk_gender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT fk_gender FOREIGN KEY (gender_fk) REFERENCES public.gender(gender_id);


--
-- Name: song fk_gender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT fk_gender FOREIGN KEY (gender_fk) REFERENCES public.gender(gender_id);


--
-- Name: artist fk_label; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT fk_label FOREIGN KEY (label_fk) REFERENCES public.music_label(label_id);


--
-- Name: artist fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

