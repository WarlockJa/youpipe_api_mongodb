const express = require('express');
const router = express.Router();
const userUnauthorizedController = require('../controllers/userUnauthorizedController');

router.route('/')
    .get(userUnauthorizedController.getAllUsers)

module.exports = router;