const router = require('express').Router();
const { signIn, lognIn, auth } = require('../controller/authController');
const checkAuth = require('../middleware/checkAuth');

// Ruta para crear una cuenta
router.post('/register', signIn);
// Ruta para crear una cuenta
router.post('/login', lognIn);
// Ruta para crear una cuenta
router.get('/', checkAuth, auth);

module.exports = router;