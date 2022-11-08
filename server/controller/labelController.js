const db = require('../db');
const jwt = require('jsonwebtoken');

const newLabel = async (req, res) => {
    const { name, description } = req.body;

    try {
        const response = await db.query(
            'INSERT INTO music_label (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(
            {
                status: 'Success',
                label: response.rows[0]
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al crear la disquera' });
    }
}

const allLabel = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        if (!decode.is_admin) {
            const response = await db.query(
                'SELECT * FROM music_label WHERE is_active = true'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows
                }
            );
        } else {
            const response = await db.query(
                'SELECT * FROM music_label'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar las disqueras' });
    }
}

const artistByLabel = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        if (!decode.is_admin) {
            const response = await db.query(
                'SELECT ml.label_id, ml.name, ml.description, COUNT(a.artist_id) AS artist FROM music_label ml LEFT JOIN artist a ON a.label_fk = ml.label_id GROUP BY ml.label_id ORDER BY name DESC'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows
                }
            );
        } else {
            const response = await db.query(
                'SELECT ml.label_id, ml.name, ml.description, COUNT(a.artist_id) AS artist FROM music_label ml LEFT JOIN artist a ON a.label_fk = ml.label_id WHERE ml.is_active = true GROUP BY ml.label_id ORDER BY name DESC'
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar las disqueras' });
    }
}

const labelById = async (req, res) => {
    const { id } = req.params;
    let token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    try {
        if (!decode.is_admin) {
            const response = await db.query(
                'SELECT * FROM music_label WHERE is_active = true AND label_id = $1',
                [id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows[0]
                }
            );
        } else {
            const response = await db.query(
                'SELECT * FROM music_label WHERE label_id = $1',
                [id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows[0]
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrio un error al consultar las disqueras' });
    }
}

const updateLabel = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const labelExist = await db.query('SELECT * FROM music_label WHERE label_id = $1', [id]);
    let label = labelExist.rows[0];

    label.name = name || label.name;
    label.description = description || label.description;

    if (label) {
        try {
            const response = await db.query(
                'UPDATE music_label SET name = $1, description = $2 WHERE label_id = $3 RETURNING *',
                [label.name, label.description, id]
            );
            res.status(200).json(
                {
                    status: 'Success',
                    label: response.rows[0]
                }
            )
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Ocurrio un error al actualizar la disquera' });
        }
    } else {
        const error = new Error('La disquera no existe');
        return res.status(404).json({ msg: error.message });
    }
}

const deleteLabel = async (req, res) => {
    const { id } = req.params;

    const labelExist = await db.query('SELECT * FROM music_label WHERE label_id = $1', [id]);
    let label = labelExist.rows[0];

    if (label) {
        try {
            const response = await db.query(
                'DELETE FROM music_label WHERE label_id = $1 RETURNING *',
                [id]
            );
            res.status(201).json(
                {
                    status: 'Se eliminó la disquera con exito',
                    label: response.rows[0]
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

module.exports = { newLabel, allLabel, artistByLabel, labelById, updateLabel, deleteLabel };