const express = require('express');
const router = express.Router();
const commentAuthorizedController = require('../controllers/commentAuthorizedController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .post(verifyRoles(ROLES_LIST.user), commentAuthorizedController.createNewComment)
    .put(verifyRoles(ROLES_LIST.user), commentAuthorizedController.updateComment)
    .delete(verifyRoles(ROLES_LIST.user), commentAuthorizedController.deleteComment);

module.exports = router;