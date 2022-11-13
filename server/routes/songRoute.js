const router = require('express').Router();
const { allSongs, newSong, songByAlbum, deleteSong, songByGender } = require('../controller/songController');

router.get('/all', allSongs);
router.get('/all/:id', songByAlbum);
router.get('/gender/:id', songByGender);
router.post('/new', newSong);
router.delete('/:id', deleteSong);

module.exports = router;