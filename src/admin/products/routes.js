const express = require('express');
const router = express.Router();

const admin_product_controller = require('./controllers/admin_product_controllers');

router.route('/create_product').post(admin_product_controller.create_product);
router.route('/update_product/:id').put(admin_product_controller.update_product);
router.route('/delete_product/:id').delete(admin_product_controller.delete_product);
router.route('/filter_products').post(admin_product_controller.filter_products);
router.route('/delete_cloudinary_image').delete(admin_product_controller.delete_cloudinary_image);

module.exports = router;