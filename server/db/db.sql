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

SELECT
    a.artist_id,
    a.name,
    a.aka,
    a.birth_day,
    a.birth_place,
    a.profile_pic,
    g.name
FROM
    artist a
    LEFT JOIN gender g ON g.gender_id = a.gender_fk
WHERE
    is_active = true;

SELECT
    al.album_id,
    al.name,
    al.album_pic,
    a.aka AS artist,
    a.profile_pic AS profile_pic,
    (
        SELECT
            COUNT(s.song_id)
        FROM
            song s
        WHERE
            s.album_fk = al.album_id
        LIMIT
            1
    ) AS song_count
FROM
    album al
    INNER JOIN artist a ON a.artist_id = al.artist_fk
WHERE
    al.is_active = true;

INSERT INTO
    song (
        album_fk,
        title,
        gender_fk,
        is_single,
        file,
        feature
    )
VALUES
    ($ 1, $ 2, $ 3, $ 4, $ 5, $ 6);

SELECT
    s.song_id,
    s.title,
    a.file,
    a.feature,
    a.name
FROM
    song a
    LEFT JOIN album a ON a.album_id = s.album_fk
WHERE
    a.album_id = $ 1;

SELECT
    s.song_id,
    s.title,
    s.file,
    s.feature,
    al.name,
    a.name AS artist
FROM
    song s
    LEFT JOIN album al ON a.album_id = s.album_fk
    LEFT JOIN artist a ON al.artist_fk = a.artist_id
WHERE
    s.is_active = true;

DELETE FROM
    music_label
WHERE
    label_id = $ 1;

SELECT
    s.song_id,
    s.title,
    s.file,
    s.feature,
    al.name,
    a.name AS artist
FROM
    song s
    LEFT JOIN album al ON a.album_id = s.album_fk
    LEFT JOIN artist a ON al.artist_fk = a.artist_id
WHERE
    s.is_active = true
    AND s.gender_fk = $ 1;

SELECT
    a.name,
    a.aka,
    a.description,
    a.birth_day,
    a.birth_place,
    g.name AS gender,
    l.name AS label
FROM
    artist a
    LEFT JOIN gender g ON g.gender_id = a.gender_fk
    LEFT JOIN label l ON l.label_id = a.label_fk
WHERE
    a.artist_id = id;

SELECT
    *
FROM
    album
WHERE
    artist_fk = id;