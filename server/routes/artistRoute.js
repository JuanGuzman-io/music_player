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
    .patch(updateArtist)
    .delete(deleteArtist)

module.exports = router;