CREATE DATABASE IF NOT EXISTS musicplayerdb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    user_id uuid DEFAULT uuid_generate_v4(),
    email VARCHAR(150) NOT NULL,
    password VARCHAR(250) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT 'f',
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS music_label (
    label_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(label_id)
);

CREATE TABLE IF NOT EXISTS gender (
    gender_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(gender_id)
);

CREATE TABLE IF NOT EXISTS artist (
    artist_id uuid DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    aka VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    birth_day DATE NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    profile_pic BYTEA NULL,
    label_fk uuid NULL,
    gender_fk uuid NULL,
    created_by uuid NOT NULL,
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(artist_id),
    CONSTRAINT fk_label FOREIGN KEY (label_fk) REFERENCES music_label(label_id),
    CONSTRAINT fk_gender FOREIGN KEY (gender_fk) REFERENCES gender(gender_id),
    CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS album (
    album_id uuid DEFAULT uuid_generate_v4(),
    artist_fk uuid NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    release_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(album_id),
    CONSTRAINT fk_artist FOREIGN KEY (artist_fk) REFERENCES artist(artist_id)
);

CREATE TABLE IF NOT EXISTS song (
    song_id uuid DEFAULT uuid_generate_v4(),
    album_fk uuid NULL,
    title VARCHAR(100) NOT NULL,
    gender_fk uuid NOT NULL,
    file BYTEA NOT NULL,
    is_single BOOLEAN NOT NULL,
    feature uuid [] NULL,
    is_active BOOLEAN DEFAULT 't',
    PRIMARY KEY(song_id),
    CONSTRAINT fk_album FOREIGN KEY (album_fk) REFERENCES album(album_id),
    CONSTRAINT fk_gender FOREIGN KEY (gender_fk) REFERENCES gender(gender_id)
);