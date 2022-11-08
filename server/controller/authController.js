// Importamos la conexión a la base de datos
const db = require('../db');
// Importamos libreria para encriptar contraseñas
const bcrypt = require('bcrypt');
const generateJWT = require('../helper/generateJWT');

const signIn = async (req, res) => {
    const { email, password, name } = req.body;

    const emailExist = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    const user = emailExist.rows[0];

    if (!user) {
        const hashedPass = await bcrypt.hash(password, 10);
        try {
            const response = await db.query(
                'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
                [email, hashedPass, name]
            );
            res.status(201).json(
                {
                    status: 'Success',
                    user: response.rows[0]
                }
            );
        } catch (error) {
            res.status(500).json({ msg: 'Ocurrio un error al crear el usuario' });
        }
    } else {
        const error = new Error('Intenta con otro correo electrónico');
        res.status(400).json({ msg: error.message });
    }
}

const lognIn = async (req, res) => {
    const { email, password } = req.body;

    const emailExist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = emailExist.rows[0];

    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            let token = generateJWT(user.user_id, user.email, user.is_admin);

            res.status(200).json({
                id: user.user_id,
                email: user.email,
                name: user.name,
                is_admin: user.is_admin,
                token
            });
        } else {
            const error = new Error('Credenciales invalidad');
            res.status(404).json({ msg: error.message });
        }
    } else {
        const error = new Error('No te encuentras registrado');
        res.status(404).json({ msg: error.message });
    }
}

const auth = async (req, res) => {
    const { user } = req;

    res.status(200).json(user.rows[0]);
}

module.exports = { signIn, lognIn, auth };