const router = require('express').Router();
const { newAlbum, allAlbums, albumById, deleteAlbum } = require('../controller/albumController');

// Los albunes
router.get('/all', allAlbums);
// Album por id
router.get('/:id', albumById);
// Nuevo album
router.post('/new', newAlbum);
// Eliminar album
router.delete('/:id', deleteAlbum);

module.exports = router;