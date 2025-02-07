const admin_prodcut_services = require('../services/admin_product_services')

module.exports = {

    create_product: async (req, res) => {
        try {
            const product = await admin_prodcut_services.createProduct_services(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update_product: async (req, res) => {
        try {
            const updatedProduct = await admin_prodcut_services.updateProduct_services(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete_product: async (req, res) => {
        try {
            const deleted = await admin_prodcut_services.deleteProduct_services(req.params.id , req.body);
            res.status(200).json(deleted);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    
    filter_products : async(req , res) => {
      try{
         const products = await admin_prodcut_services.filterProducts_services(req.body);
         res.status(200).json(products);
      } catch(error){
          res.status(400).json({ message: error.message });
      }
    },
    delete_cloudinary_image : async(req , res) => {
        try{
            const deleted = await admin_prodcut_services.deleteCloudinaryImage_services(req.body);
            res.status(200).json(deleted);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}