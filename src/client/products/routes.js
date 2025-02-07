const express = require('express');
const router = express.Router();
const product_controller = require('./controllers/product_controller');

router.route('/get_new-arrival_10').get(product_controller.get_new_arrival)
router.route('/get_products').get(product_controller.get_products);
router.route('/get_products/:id').get(product_controller.get_product_id);
router.route('/filter_data').post(product_controller.filter_product);

module.exports = router;