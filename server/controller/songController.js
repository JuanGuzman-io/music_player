const db = require('../db');

const allSongs = async (req, res) => {
    try {
        const response = await db.query(
            `SELECT
                s.song_id,
                s.title,
                s.file,
                s.feature,
                al.name,
                al.album_pic,
                a.aka AS artist
            FROM
                song s
                LEFT JOIN album al ON al.album_id = s.album_fk
                LEFT JOIN artist a ON al.artist_fk = a.artist_id
            WHERE
                s.is_active = true
                ORDER BY s.title ASC;`
        );
        res.status(200).json(
            {
                status: 'Todas las canciones',
                songs: response.rows
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const newSong = async (req, res) => {
    const { album_fk, title, gender_fk, is_single, file, feature } = req.body;
    try {
        const response = await db.query(
            `INSERT INTO
            song (
                album_fk,
                title,
                gender_fk,
                is_single,
                file,
                feature
            )
        VALUES
            ($1, $2, $3, $4, $5, $6)`,
            [album_fk, title, gender_fk, is_single, file, feature]
        );
        res.status(201).json(
            {
                status: 'Se creo la canción',
                song: response.rows[0]
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const songByAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db.query(
            `SELECT
                s.song_id,
                s.title,
                s.file,
                s.feature,
                a.name
            FROM
                song s
                LEFT JOIN album a ON a.album_id = s.album_fk
            WHERE
                a.album_id = $1;`,
            [id]
        );
        res.status(201).json(
            {
                status: 'Todas las canciones del album',
                songs: response.rows
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const deleteSong = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.query(
            `DELETE FROM
                song
            WHERE
                song_id = $1 RETURNING *`,
            [id]
        );
        res.status(202).json(
            {
                status: 'Se elimino la canción',
                song: response.rows[0]
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear el album' });
    }
}

const songByGender = async (req, res) => {
    const { id } = req.params;
    try {
        const gender = await db.query(
            `SELECT
                *
            FROM
                gender
            WHERE 
                gender_id = $1`,
            [id]
        );
        const response = await db.query(
            `SELECT
                s.song_id,
                s.title,
                s.file,
                s.feature,
                al.name,
                a.name AS artist,
                g.name
            FROM
                song s
                LEFT JOIN album al ON al.album_id = s.album_fk
                LEFT JOIN artist a ON al.artist_fk = a.artist_id
                LEFT JOIN gender g ON s.gender_fk = g.gender_id
            WHERE
                s.is_active = true
                AND s.gender_fk = $1;`,
            [id]
        );
        res.status(200).json(
            {
                genero: gender.rows[0],
                status: 'Todas las canciones del genero',
                songs: response.rows
            }
        )
    } catch (error) {
        console.log(error);
    }
}

module.exports = { allSongs, newSong, songByAlbum, deleteSong, songByGender };