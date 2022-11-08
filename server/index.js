// Se importa dotenv para las variables de entorno
require('dotenv').config();
// Servidor REST express
const express = require('express');
// Cors
const cors = require('cors');
// Se inicializa el servidor
const app = express();
// Declaramos el puerto
const port = process.env.PORT || 4000;

// En el servidor utilizamos el polocy CORS
app.use(cors());
// Parseamos todo el servidor para convertirlo a json
app.use(express.json());

// Importamos las rutas
const { authRoute, labelRoute, genderRoute, artistRoute } = require('./routes');
const checkAuth = require('./middleware/checkAuth');

// Ruta de prueba
app.get('/', (req, res) => res.send('<h1><strong>Hello World<strong><h1>'));
// Ruta de autenticación
app.use('/api/auth', authRoute);
// Ruta de productores/discografias
app.use('/api/label', checkAuth, labelRoute);
// Ruta de genero
app.use('/api/gender', checkAuth, genderRoute);
// Ruta de genero
app.use('/api/artist', checkAuth, artistRoute);


// Indicamos el puerto antes declarado
app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});