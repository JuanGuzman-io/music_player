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

const allArtist = async (req, res) => { }

const artistById = async (req, res) => { }

const updateArtist = async (req, res) => { }

const deleteArtist = async (req, res) => { }


module.exports = { newArtist, allArtist, artistById, updateArtist, deleteArtist };