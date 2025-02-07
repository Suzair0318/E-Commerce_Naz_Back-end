const express = require('express');
const router = express.Router();
const orders_controller = require('./controllers/orders_controllers');
const { middleware } = require('../../user/middleware/user_middleware');


router.route('/get_cart').get( middleware ,orders_controller.get_cart);
router.route('/create_cart').post( middleware ,  orders_controller.create_cart);
router.route('/update_cart/:id').put( middleware , orders_controller.update_cart)
router.route('/delete_cart/:id').delete( middleware ,  orders_controller.delete_cart)
router.route('/create_order').post( middleware ,orders_controller.create_order);
router.route('/get_order_history').get( middleware , orders_controller.get_order_history)

module.exports = router;