const Product_DB = require('../models/product_model');

module.exports = {

    getLastFiveProducts: async () => {
            return await Product_DB.find({})
                .sort({ createdAt: -1 }) // Sort by creation date in descending order
                .limit(5); // Limit the result to 5 products
    },
    getAllProducts_services: async () => {
            return await Product_DB.find({});
    },

    getProductById_services: async (id) => {
            return await Product_DB.findById(id).populate({
                path: "comments",
                select: "comment createdAt",
                populate: {
                    path: "userId",
                    select: "name -_id",
                },
            });
    },

    filterProduct_services: async (body) => {
            const { name, price_min, price_max, category, brand, sizes, features } = body;  
            // Create filters object
            let filters = {};
            if (name) {
                filters = {
                    $or: [
                        { name: { $regex: name, $options: 'i' } },
                        { brand: { $regex: name, $options: 'i' } },
                        { category: { $regex: name, $options: 'i' } },
                    ]
                };
              }
            if (price_min) filters.price = { ...filters.price, $gte: price_min };
            if (price_max) filters.price = { ...filters.price, $lte: price_max };
            if (category) filters.category = category;
            if (brand) filters.brand = brand;
            if (sizes) filters.sizes = { $in: sizes };
            if (features) filters.features = { $in: features };
            return await Product_DB.find(filters);
    }
}