const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  comment: { type: String , required: true },
},{timestamps : true});

module.exports = mongoose.model('Comments', commentSchema);
