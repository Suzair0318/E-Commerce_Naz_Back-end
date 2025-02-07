const Cart_DB = require('../models/cart_model');
const Order_DB = require('../models/orders_models');
const Product_DB = require('../../products/models/product_model');
// const Whast_app_Client = require('../../../../index');
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Initialize WhatsApp client with session storage
const client = new Client({
  authStrategy: new LocalAuth(), // Saves session automatically
});

client.on("qr", (qr) => {
  console.log("Scan this QR Code to login:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp is ready and session is saved!");
});

// Start WhatsApp client
client.initialize();



module.exports = {

  create_cart_repo: async (userId, body) => {
      const { productId, quantity, sizes } = body;
      if (!productId || !quantity || !sizes) {
        throw new Error("ProductId, quantity, and sizes are required.");
      }
      // Check if product already exists in user's cart
      let cart = await Cart_DB.findOne({ userId });

      if (cart) {
        const productIndex = cart.products.findIndex(
          (item) => item.productId.toString() === productId
        );
        if (productIndex > -1) {
          cart.products[productIndex].quantity = quantity;
          cart.products[productIndex].sizes = sizes;
      
        } else {
          cart.products.push({ productId, quantity, sizes });
        }
        await cart.save();
      } else {
        cart = new Cart_DB({ userId, products: [{ productId, quantity, sizes }] });
        await cart.save();
      }

      return cart;
  },

  create_order_repo: async (userId, body) => {
    
      const cart = await Cart_DB.findOne({ userId }).populate('products.productId'); // Populate 
      if (!cart || cart.products.length === 0) {
        throw new Error('Cart is empty.');
      }
   
      //  Update product stock
    for (const item of body.products) {
      const { productId, quantity } = item;
       
      const product = await Product_DB.findById(productId);
      console.log(product);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }
      
      // Ensure enough stock is available
      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
        );
      }

      // Deduct stock
      product.stock -= quantity;
      await product.save();
      
    }
      const order = new Order_DB({
        userId,
        ...body
      });
      await order.save();

      // Clear the cart after order placement
      await Cart_DB.findOneAndDelete({ userId });
      
      const clientMessage = `
      🎉 *Order Confirmation*\n
      💰 *Amount:* Rs. ${order.totalPrice}\n
      📦 *Order ID:* ${order._id}\n
      ✅ Thank you for shopping with Naz's Collections!\n
      If you need any help or contact us you can directly message to this number.
      `;
  // Admin message
  const adminMessage = `
  📢 *New Order Placed!*\n 
  💰 *Amount:* Rs. ${order.totalPrice}\n
  📦 *Order ID:* ${order._id}\n
  ⚡ Please process this order.`;
 
      await client.sendMessage(`92${order.address[0].phone.replace(/^0/, "")}@c.us`, clientMessage);
      await client.sendMessage(`3083690944@c.us`, adminMessage);

      return order;
  },

  get_cart_repo: async (userId) => {
      return await Cart_DB.findOne({ userId }).populate({
        path: 'products.productId',
        select: '-comments'  // Exclude 'comments' from the populated product data
      });
  },

  update_cart_repo: async (userId, _id, body) => {
      const { quantity } = body;
      const cart = await Cart_DB.updateOne(
        { userId, 'products.productId': _id }, // Match by userId and productId
        { $set: { 'products.$.quantity': quantity } }, // Update the quantity
      );
      return cart;
  },

  delete_cart_repo: async (userId, _id) => {
      const cart = await Cart_DB.updateOne(
        { userId }, // Match the cart by userId
        { $pull: { products: { _id } } } // Remove product from products array
      );
      return cart;
  },

  get_order_history_repo: async (userId) => {
  
      const orders = await Order_DB.find({ userId })
        .select('products  createdAt') // Select only products and totalPrice fields
        .populate({
          path: 'products.productId', // Populate the product details
          model: 'Product'
        });
      return orders;
  }
}