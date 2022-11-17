--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6 (Homebrew)
-- Dumped by pg_dump version 14.6 (Homebrew)

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
    is_active boolean DEFAULT true,
    album_pic character varying(300),
    release_date character varying(30)
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
    birth_place character varying(100) NOT NULL,
    label_fk uuid,
    gender_fk uuid,
    created_by uuid NOT NULL,
    is_active boolean DEFAULT true,
    profile_pic character varying(300),
    birth_day character varying(25)
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
    is_single boolean NOT NULL,
    is_active boolean DEFAULT true,
    file character varying(300) NOT NULL,
    feature character varying
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

COPY public.album (album_id, artist_fk, name, description, is_active, album_pic, release_date) FROM stdin;
09b08840-95e1-405c-950d-fe9e90c5f5f3	24095f3b-1c57-4b36-860f-53b19d502a8a	Grupo Niche The Best	Grupo Niche The Best	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/album%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668297996108.jpeg?alt=media&token=e23e19ec-f618-4252-aa31-70aaa17b33f2	2021-12-31
358477be-718b-431c-80cd-c77908e91e3a	6d165f5f-d1d1-4acf-9050-3e3813a51059	En Vivo Vol.1	En Vivo Vol.1	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/album%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668291714801.jpeg?alt=media&token=645331d2-8e63-46e6-9af8-06f9191386e5	2021-12-31
5108217b-5580-4f9e-ad98-5645b472fa01	1f9fc61d-2a86-496e-8153-b1bec52aaee6	SIEMPRE	SIEMPRE	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/album%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668295166326.jpeg?alt=media&token=78e64096-1c8d-4f3c-91e8-f868a854d87c	2021-12-31
9b6e7307-d12e-42f9-a4ed-a9cba7d0615b	beb44061-093a-45c4-8aec-f8ce6755fda3	Real Hasta la Muerte	Real Hasta la Muerte	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/album%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668283777512.jpeg?alt=media&token=d7311b30-1506-4334-85e2-a2a89aedb75d	2021-12-31
673591b2-91d9-4e97-a909-c6f1e621819d	24095f3b-1c57-4b36-860f-53b19d502a8a	Algo que se quede	Melodia de Grupo NIche	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/album%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668360064281.jpeg?alt=media&token=1145eca6-87f0-4fdc-abf0-93ea57ca8db9	2021-09-09
\.


--
-- Data for Name: artist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist (artist_id, name, aka, description, birth_place, label_fk, gender_fk, created_by, is_active, profile_pic, birth_day) FROM stdin;
beb44061-093a-45c4-8aec-f8ce6755fda3	Emmanuel Gazmey Santiago	Anuel AA	Emmanuel Gazmey Santiago conocido profesionalmente como Anuel AA , es un rapero y cantante puertorriqueño. Su música a menudo contiene muestras e interpolaciones de canciones que fueron populares durante su juventud.	Carolina, Puerto Rico	1d72914b-09db-4af5-a6ed-8f41123dda51	707d7b48-340f-4d41-ad98-eef361d84db4	db657660-351b-4593-940d-07c08126a66b	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/uploads%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668274132624.jpeg?alt=media&token=bfd23bb3-ffda-4ce4-90b4-476903706860	1992-11-26
24095f3b-1c57-4b36-860f-53b19d502a8a	Grupo Niche	Grupo Niche	Grupo Niche	Cali, Colombia	1d72914b-09db-4af5-a6ed-8f41123dda51	5d2ab41d-0cb7-40e8-964b-ff44dcf9a8d5	db657660-351b-4593-940d-07c08126a66b	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/artists%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668297913511.jpeg?alt=media&token=e77fb0b0-4423-4b52-b186-64750c39b94b	1978-12-12
1f9fc61d-2a86-496e-8153-b1bec52aaee6	Pirlo	Pirlo 420	Pirlo	Cali, Colombia	bc1cced4-4c4f-4f54-aab9-aa3af4cb70e2	707d7b48-340f-4d41-ad98-eef361d84db4	db657660-351b-4593-940d-07c08126a66b	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/artists%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668295115599.jpeg?alt=media&token=cdc67128-f53d-4ded-be94-a508a63b2669	1998-11-22
6d165f5f-d1d1-4acf-9050-3e3813a51059	Grupo Frontera	Grupo Frontera	Grupo Frontera	México	1d72914b-09db-4af5-a6ed-8f41123dda51	840db4c3-5afa-48e5-980a-b513047e8690	db657660-351b-4593-940d-07c08126a66b	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/artists%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668291641010.jpeg?alt=media&token=2ea1107d-908b-42c0-8695-cbff6b410e12	2002-11-11
\.


--
-- Data for Name: gender; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gender (gender_id, name, description, is_active) FROM stdin;
5d2ab41d-0cb7-40e8-964b-ff44dcf9a8d5	Salsa	La música salsa es un estilo de música latinoamericana . Debido a que la mayoría de los componentes musicales básicos son anteriores al etiquetado de la salsa, ha habido muchas controversias con respecto a su origen.	t
840db4c3-5afa-48e5-980a-b513047e8690	Regional Méxicana	Regional Mexicano es un formato de radio de música latina que abarca los géneros musicales de las diversas partes de las zonas rurales de México y el suroeste de los Estados Unidos .	t
5d94d09a-1b01-4c23-8831-a47690d3e978	Trap	El trap es un subgénero musical del rap que se originó en la década de los 90 en el sur de los Estados Unidos	t
707d7b48-340f-4d41-ad98-eef361d84db4	Reggaetónn	El reguetón4 es un género musical5 que derivó del reggae en español que es a su vez un subgénero del dancehall, así como elementos principalmente de la música bounce. Es un género musical muy popular hasta hoy en día; que ha llegado a alcanzar sus apogeos máximos durante las décadas del 2000 y 2010.	t
\.


--
-- Data for Name: music_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.music_label (label_id, name, description, is_active) FROM stdin;
bc1cced4-4c4f-4f54-aab9-aa3af4cb70e2	Universal Music	Universal Music Inc.	t
1d72914b-09db-4af5-a6ed-8f41123dda51	Sony Music	Sony Music Inc. Latam	t
\.


--
-- Data for Name: song; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.song (song_id, album_fk, title, gender_fk, is_single, is_active, file, feature) FROM stdin;
3bd2ae4c-68f1-40f8-8687-5d3853189cc2	9b6e7307-d12e-42f9-a4ed-a9cba7d0615b	Amanece	707d7b48-340f-4d41-ad98-eef361d84db4	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668289667816.mpeg?alt=media&token=4927b08a-9d56-41bd-bca8-3afa16323b78	\N
3a8da487-1fbb-438a-a722-e0f842be2d2b	358477be-718b-431c-80cd-c77908e91e3a	No se va	840db4c3-5afa-48e5-980a-b513047e8690	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668291755045.mpeg?alt=media&token=311acb3b-bbfb-4085-877b-fe7d05a9ee94	\N
9882bf15-7cdf-460a-b1a5-d34acda0fa00	9b6e7307-d12e-42f9-a4ed-a9cba7d0615b	La 2BLEA	707d7b48-340f-4d41-ad98-eef361d84db4	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668294135457.mpeg?alt=media&token=00d846aa-5a02-4e1d-bf9f-2b2350d9647c	\N
abaa5214-9203-4941-a752-050a8f5de2ae	5108217b-5580-4f9e-ad98-5645b472fa01	Ziploc (REMIX)	707d7b48-340f-4d41-ad98-eef361d84db4	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668295222575.mpeg?alt=media&token=69ed0b47-c614-4676-bd68-a64509bea08f	\N
9943f7a3-dfb8-497f-804f-cb78c1fc8a98	09b08840-95e1-405c-950d-fe9e90c5f5f3	Busca por dentro	5d2ab41d-0cb7-40e8-964b-ff44dcf9a8d5	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668298036309.mpeg?alt=media&token=892a06a0-5f3a-4117-acf2-f36b209ee801	\N
d9116288-e184-4626-95a8-c04b72ebf956	9b6e7307-d12e-42f9-a4ed-a9cba7d0615b	Diamantes En Mis Dientes	5d94d09a-1b01-4c23-8831-a47690d3e978	t	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668350739566.mpeg?alt=media&token=4aa0e86f-f849-4eda-bc60-b86281d375f4	Yovng Chimi
16839155-e112-451d-8dcf-26898a901b36	673591b2-91d9-4e97-a909-c6f1e621819d	Algo Que se Quede	5d2ab41d-0cb7-40e8-964b-ff44dcf9a8d5	f	t	https://firebasestorage.googleapis.com/v0/b/music-player-5e97e.appspot.com/o/songs%2Fdb657660-351b-4593-940d-07c08126a66b%2F1668360105373.mpeg?alt=media&token=c67c842b-0ab9-4711-a962-93ca44dc0f23	
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

