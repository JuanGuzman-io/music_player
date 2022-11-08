const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await db.query('SELECT user_id, name, email, is_admin FROM users WHERE user_id = $1', [decode.id]);
            return next();
        } catch (error) {
            return res.status(404).json({ msg: 'Token no valido' });
        }
    }

    if (!token) {
        const error = new Error('Ha ocuriddo un error, inicia sesión');
        return res.status(401).json({ msg: error.message });
    }
}

module.exports = checkAuth;