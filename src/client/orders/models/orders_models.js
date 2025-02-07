
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      sizes : {type : String , required : true}
    },
  ],
  totalPrice: { type: Number, required: true },
  address: [
    {
    street: { type: String, required: true }, // Street name or house number
    city: { type: String, required: true }, // City name
    state: { type: String }, // Optional state/province
    country: { type: String, default : "Pakistan" }, // Country name
    phone: { type: String, required: true }, // Phone number for delivery contact
    }
  ],
  shipment_charges : { type : Number , required:true},
  status: { type: String, default: 'Booked' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);