const express = require('express');
const router = express.Router();
const userAuthorizedController = require('../controllers/userAuthorizedController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.user), userAuthorizedController.getAuthorizedUserData)
    .put(verifyRoles(ROLES_LIST.user), userAuthorizedController.updateUserData)
    // .delete(verifyRoles(ROLES_LIST.Admin), userAuthorizedController.deleteUser);

module.exports = router;