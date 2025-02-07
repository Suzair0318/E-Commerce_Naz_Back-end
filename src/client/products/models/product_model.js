
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    cutPrice: { type: Number  , required: true   }, 
    discount: {type: Number},  
    brand: { type: String, required: true },
    category: { type: String , required: true  },
    sizes: { type: [String], enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
    stock: { type: Number, default: 1 },
    rating : { type: Number, default:4.5},
    weight : {type : Number , default : 1},
    images: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      }],
    features: [String], 
    comments : [ {type : mongoose.Schema.Types.ObjectId , ref : 'Comments'}]
},{timestamps : true});

// Pre-save middleware to calculate discountPrice
productSchema.pre('save', function (next) {
    if (this.cutPrice && this.price) {
        this.discount = ((this.cutPrice - this.price) / this.cutPrice) * 100;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema); 

  