const jwt = require('jsonwebtoken');

const generateJWT = (id, email, is_admin) => {
    return jwt.sign({ id, email, is_admin }, process.env.JWT_SECRET, {
        expiresIn: '6h',
    });
};

module.exports = generateJWT;