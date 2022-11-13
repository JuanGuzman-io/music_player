const db = require('../db');
const jwt = require('jsonwebtoken');

const newArtist = async (req, res) => {
    const { name, aka, description, birth_day, birth_place, profile_pic, label_fk, gender_fk } = req.body;

    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const response = await db.query(
            `INSERT INTO
            artist (
                name,
                aka,
                description,
                birth_day,
                birth_place,
                profile_pic,
                label_fk,
                gender_fk,
                created_by
                )
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, aka, description, birth_day, birth_place, profile_pic, label_fk, gender_fk, decode.id]
        );
        res.status(200).json(
            {
                status: `Se agrego el artista ${aka} con exito`,
                artist: response.rows[0]
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear el artista' });
    }
}

const allArtist = async (req, res) => {
    try {
        const response = await db.query(
            `SELECT
                a.artist_id,
                a.name,
                a.aka,
                a.birth_day,
                a.birth_place,
                a.profile_pic,
                g.name AS gender
            FROM
                artist a
                LEFT JOIN gender g ON g.gender_id = a.gender_fk
            WHERE
                a.is_active = true;`
        );
        res.status(200).json(
            {
                status: 'Todos los artistas',
                artists: response.rows
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar los artistas' });
    }
}

const artistById = async (req, res) => {
    const { id } = req.params;

    try {
        const artist = await db.query(
            `SELECT
                a.name,
                a.aka,
                a.profile_pic,
                a.description,
                a.birth_day,
                a.birth_place,
                g.name AS gender,
                l.name AS label
            FROM
                artist a
                LEFT JOIN gender g ON g.gender_id = a.gender_fk
                LEFT JOIN music_label l ON l.label_id = a.label_fk
            WHERE
                a.artist_id = $1`,
            [id]
        );
        const albums = await db.query(
            `SELECT
                *
            FROM
                album
            WHERE
                artist_fk = $1`,
            [id]
        );
        res.status(200).json(
            {
                status: ' Todos los albunes del artist',
                artist: artist.rows[0],
                albums: albums.rows
            }
        )
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar el artista' });
    }
}

const deleteArtist = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await db.query(
            `DELETE FROM
                artist
            WHERE
                artist_id = $1;`,
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

const updateArtist = async (req, res) => {
    const { id } = req.params;
    const { name, aka, description, birth_place, birth_day, label_fk, gender_fk, profile_pic } = req.body;

    const artistExist = await db.query('SELECT * FROM artist WHERE artist_id = $1', [id]);
    let artist = artistExist.rows[0];

    artist.name = name || artist.name;
    artist.aka = aka || artist.aka;
    artist.description = description || artist.description;
    artist.birth_place = birth_place || artist.birth_place;
    artist.birth_day = birth_day || artist.birth_day;
    artist.label_fk = label_fk || artist.label_fk;
    artist.gender_fk = gender_fk || artist.gender_fk;
    artist.profile_pic = profile_pic || artist.profile_pic;

    if (artist) {
        try {
            const response = await db.query(
                `UPDATE
                    artist
                SET
                    name = $1,
                    aka = $2,
                    description = $3,
                    birth_place = $4,
                    birth_day = $5,
                    label_fk = $6,
                    gender_fk = $7,
                    profile_pic = $8
                WHERE
                    artist_id = $9 RETURNING *`,
                [artist.name, artist.aka, artist.description, artist.birth_place, artist.birth_day, artist.label_fk, artist.gender_fk, artist.profile_pic, id]
            );
            res.status(200).json(
                {
                    status: `Se actualizó el artista ${artist.aka}`,
                    artist: response.rows[0]
                }
            )
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Ocurrio un error al actualizar el artista' });
        }
    } else {
        const error = new Error('El artista no existe');
        return res.status(404).json({ msg: error.message });
    }
}

module.exports = { newArtist, allArtist, artistById, updateArtist, deleteArtist };