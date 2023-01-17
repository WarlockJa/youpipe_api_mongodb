const express = require('express');
const router = express.Router();
const commentUnauthorizedController = require('../controllers/commentUnauthorizedController');

router.route('/')
    .post(commentUnauthorizedController.getVideoComments);

module.exports = router;