const db = require('../db');
const jwt = require('jsonwebtoken');

const allAlbums = async (req, res) => {
    try {
        const response = await db.query(
            `SELECT
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
                al.is_active = true;`
        );
        res.status(200).json(

            {
                status: 'Todos los albumnes',
                albums: response.rows
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const albumById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db.query(
            `SELECT
                al.album_id,
                al.name,
                al.description,
                al.release_date,
                al.album_pic,
                a.aka AS artist,
                a.profile_pic
            FROM
                album al
                LEFT JOIN artist a ON a.artist_id = al.artist_fk
            WHERE
                al.is_active = true
                AND al.album_id = $1`,
            [id]
        );
        res.status(200).json(

            {
                status: 'Album por id',
                album: response.rows[0]
            }
        )
    } catch (error) {
        console.log(error);
    }
}

const newAlbum = async (req, res) => {
    const { name, artist_fk, description, release_date, album_pic } = req.body;

    try {
        const response = await db.query(
            `INSERT INTO
            album (
                name,
                artist_fk,
                description,
                release_date,
                album_pic
                )
            VALUES
            ($1, $2, $3, $4, $5) RETURNING *`,
            [name, artist_fk, description, release_date, album_pic]
        );
        res.status(201).json(
            {
                status: `Se agrego el album ${name} con exito`,
                album: response.rows[0]
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear el album' });
    }
}

const deleteAlbum = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db.query(
            `DELETE FROM
                album
            WHERE
                album_id = $1;`,
            [id]
        );
        res.status(202).json(
            {
                status: 'Se eliminó el album',
                album: response.rows[0]
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear el album' });
    }
}


module.exports = { allAlbums, newAlbum, albumById, deleteAlbum };