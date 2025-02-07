const Product_DB = require('../../../client/products/models/product_model');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'de2nzvcrd',
  api_key: '825669894714912',
  api_secret: 'oF8KTSpoHsYcBYiA7mo-pJDAgtA',
});

module.exports = {

    createProduct_services: async (productData) => {
            const product = new Product_DB(productData);
            return await product.save();
    },

    updateProduct_services: async (id, updateData) => {
            const { remove_images, ...otherFields } = updateData;
             // Step 2: Handle removed images
    if (remove_images && Array.isArray(remove_images)) {
        await Promise.all(
          remove_images.map(async (url) => {
            const publicId = url.split('/').pop().split('.')[0]; // Extract public_id
            await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
          })
        );
      }

            return await Product_DB.findByIdAndUpdate(id, { ...otherFields }, { new: true });
    },

    deleteProduct_services: async (id , body) => {
       
            const {remove_images} = body;
            if (remove_images && Array.isArray(remove_images)) {
                await Promise.all(
                  remove_images.map(async ({public_id}) => {
                    await cloudinary.uploader.destroy(public_id); // Delete from Cloudinary
                  })
                );
              }
            await Product_DB.findByIdAndDelete(id);
            return { message: 'Product deleted successfully' };
    },

    filterProducts_services : async(body) => {
        
          const { search, brand, category } = body;
          let filterConditions = {};
          // General search logic
        if (search) {
          filterConditions = {
              $or: [
                  { name: { $regex: search, $options: 'i' } },
                  { brand: { $regex: search, $options: 'i' } },
                  { category: { $regex: search, $options: 'i' } },
                  { sizes: { $in: search.split(',') } },
                  { price: { $lte: parseFloat(search) } }
              ]
          };
        }
        if (brand) filterConditions.brand = { $regex: brand, $options: 'i' };
        if (category) filterConditions.category = { $regex: category, $options: 'i' };

        const products = await Product_DB.find(filterConditions).select('-comments');
        return products;
    },

    deleteCloudinaryImage_services : async(body) => {
            const {remove_images} = body;
             // Extract public_id from each URL and delete from Cloudinary
    const results = await Promise.all(
        remove_images.map(async (url) => {
          const publicId = url.split('/').pop().split('.')[0]; // Extract public_id
          const resultss = await cloudinary.uploader.destroy(publicId);
          return  resultss.result ; // Return result for each image
        })
      );
      if (results.includes('ok')) {
        return { message: 'Image deleted successfully'  };
       } else {
        throw new Error('Failed to delete image');
       }
    
        
    }
}