const db = require('../db');
const jwt = require('jsonwebtoken');

const newGender = async (req, res) => {
    const { name, description } = req.body;

    try {
        const response = await db.query(
            'INSERT INTO gender (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(
            {
                status: 'Success',
                gender: response.rows[0]
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear el genero' });
    }
}

const allGender = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        if (!decode.is_admin) {
            const response = await db.query(
                'SELECT * FROM gender WHERE is_active = true'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    gender: response.rows
                }
            );
        } else {
            const response = await db.query(
                'SELECT * FROM gender'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    gender: response.rows
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar los generos' });
    }
}

const genderById = async (req, res) => {
    const { id } = req.params;
    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        if (!decode.is_admin) {
            const response = await db.query(
                'SELECT * FROM gender WHERE is_active = true AND gender_id = $1',
                [id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    gender: response.rows[0]
                }
            );
        } else {
            const response = await db.query(
                'SELECT * FROM gender WHERE gender_id = $1',
                [id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    gender: response.rows[0]
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar el genero' });
    }
}

const updateGender = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const genderExist = await db.query('SELECT * FROM gender WHERE gender_id = $1', [id]);
    let gender = genderExist.rows[0];

    gender.name = name || gender.name;
    gender.description = description || gender.description;

    if (gender) {
        try {
            const response = await db.query(
                'UPDATE gender SET name = $1, description = $2 WHERE gender_id = $3 RETURNING *',
                [gender.name, gender.description, id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    gender: response.rows[0]
                }
            )
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Ocurrio un error al actualizar el genero' });
        }
    } else {
        const error = new Error('El genero no existe');
        return res.status(404).json({ msg: error.message });
    }
}

const deleteGender = async (req, res) => {
    const { id } = req.params;

    const genderExist = await db.query('SELECT * FROM gender WHERE gender_id = $1', [id]);
    let gender = genderExist.rows[0];

    if (gender) {
        try {
            const response = await db.query(
                'DELETE FROM gender WHERE gender_id = $1 RETURNING *',
                [id]
            );
            res.status(201).json(
                {
                    status: `Se eliminó el genero ${gender.name} con exito`,
                    gender: response.rows[0]
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Ocurrio un error al actualizar la disquera' });
        }
    } else {
        const error = new Error('La disquera no existe');
        return res.status(404).json({ msg: error.message });
    }
}

module.exports = { newGender, allGender, genderById, updateGender, deleteGender };