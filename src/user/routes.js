const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/user_controller');
const { middleware } = require('./middleware/user_middleware');

router.route('/register').post(user_controller.user_register);
router.route('/login').post(user_controller.user_login);
router.route('/verify_token').post( middleware ,  user_controller.user_verify_token);
router.route('/find_user').post(user_controller.user_find_by_email);
router.route('/check_otp').post(user_controller.user_check_otp);
router.route('/update_passwrod').post(user_controller.user_update_passowrd);

module.exports = router;