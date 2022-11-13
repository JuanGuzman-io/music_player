const router = require('express').Router();
const { newAlbum, allAlbums, albumById, deleteAlbum, updateAlbum } = require('../controller/albumController');

// Los albunes
router.get('/all', allAlbums);
// Nuevo album
router.post('/new', newAlbum);
//  album
router
    .route('/:id')
    .get(albumById) 
    .delete(deleteAlbum)
    .patch(updateAlbum);

module.exports = router;