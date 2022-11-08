const router = require('express').Router();
const { newGender, allGender, genderById, updateGender, deleteGender } = require('../controller/genderController');

// Ruta para crear un genero
router.post('/new', newGender);
// Ruta para traer todas los generos
router.get('/all', allGender);
// Ruta para obtener, actualizar o eliminar un genero por ID
router
    .route('/:id')
    .get(genderById)
    .patch(updateGender)
    .delete(deleteGender);

module.exports = router;