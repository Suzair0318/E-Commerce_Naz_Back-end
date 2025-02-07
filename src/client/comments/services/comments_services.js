const Comment_DB = require('../models/comment_model');
const Product_DB = require('../../products/models/product_model');

module.exports = {
    create_comment_service : async( userId ,  body) => {
        
             const {productId , comment} = body;
               const find_prodcut = await Product_DB.findOne({_id : productId });
               if(!find_prodcut) throw new Error('Product_id not found')
               const comment_created = new Comment_DB({ userId, productId , comment});
               await comment_created.save();
               find_prodcut.comments.push(comment_created._id);  
               await find_prodcut.save();
               return {message : 'Comment added successfully'};
   }
}