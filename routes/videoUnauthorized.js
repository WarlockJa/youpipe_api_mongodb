const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoUnauthorizedController');

router.route('/')
    .post(videoController.getVideos);

module.exports = router;