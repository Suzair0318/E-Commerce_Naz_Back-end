
const ProductService = require('../services/product_services');

module.exports = {

  get_new_arrival: async (req, res) => {
    try {
      const products = await ProductService.getLastFiveProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  get_products: async (req, res) => {
    try {
      const products = await ProductService.getAllProducts_services();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  get_product_id: async (req, res) => {
    try {
      const product = await ProductService.getProductById_services(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  filter_product: async (req, res) => {
    try {
      const products = await ProductService.filterProduct_services(req.body);
      res.status(200).json(products);
    }
    catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

};

