const express = require('express');
const router = express.Router();
const comment_controller = require('./controllers/comments_controller');
const { middleware } = require('../../user/middleware/user_middleware');
router.route('/create_comment').post( middleware ,  comment_controller.create_comments);

module.exports = router;