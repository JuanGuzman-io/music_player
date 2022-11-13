const router = require('express').Router();
const { artistById, updateArtist, deleteArtist, allArtist, newArtist } = require('../controller/artistController');

// Route to add new artist
router.post('/new', newArtist);
// Route to add new artist
router.get('/all', allArtist);
// Route to add new artist
router
    .route('/:id')
    .get(artistById)
    .delete(deleteArtist)
// Act
router.put('/patch/:did', updateArtist);

module.exports = router;