const express = require('express');
const router = express.Router();
const admin_orders_controller = require('../orders/controllers/admin_orders_controller');

router.route('/get_orders').get(admin_orders_controller.get_orders);
router.route('/get_orders/:id').get(admin_orders_controller.get_orders_id);
router.route('/filter_orders').post(admin_orders_controller.filter_orders);
router.route('/get_weekly_stats').get(admin_orders_controller.get_weekly_orders_stats);

module.exports = router;