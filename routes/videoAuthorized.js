const express = require('express');
const router = express.Router();
const videoAuthorizedController = require('../controllers/videoAuthorizedController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .post(verifyRoles(ROLES_LIST.user), videoAuthorizedController.createNewVideo)

module.exports = router;