const router = require('express').Router();
const { newAlbum, allAlbums, albumById } = require('../controller/albumController');

// Los albunes
router.get('/all', allAlbums);
// Album por id
router.get('/:id', albumById);
// Nuevo album
router.post('/new', newAlbum);


module.exports = router;