const router = require('express').Router();
const { newLabel, allLabel, updateLabel, deleteLabel, labelById, artistByLabel } = require('../controller/labelController');

// Ruta para crear una disquera
router.post('/new', newLabel);
// Ruta para traer todas las disqueras
router.get('/all', allLabel);
// Ruta para traer todas las disqueras y artistas
router.get('/label-artist', artistByLabel);
// Ruta para obtener, actualizar o eliminar una disquera por ID
router
    .route('/:id')
    .get(labelById)
    .patch(updateLabel)
    .delete(deleteLabel);

module.exports = router;