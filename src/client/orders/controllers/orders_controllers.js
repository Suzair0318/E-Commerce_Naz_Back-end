
const orders_repo = require('../repo/orders_repo');

module.exports = {

  create_cart: async (req, res) => {
    try {
      const { _id } = req.auth_user;
      const cart = await orders_repo.create_cart_repo(_id, req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  get_cart: async (req, res) => {
    try {
      const { _id } = req.auth_user;
      const cart = await orders_repo.get_cart_repo(_id);
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  delete_cart: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id } = req.auth_user;
      const del = await orders_repo.delete_cart_repo(_id, id);
      res.status(200).json(del);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  },

  update_cart: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id } = req.auth_user;
      const del = await orders_repo.update_cart_repo(_id, id, req.body);
      res.status(200).json(del);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  },

  create_order: async (req, res) => {
    try {
      const { _id } = req.auth_user;
      const order_placed = await orders_repo.create_order_repo(_id, req.body);
      res.status(201).json(order_placed);
    }
    catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  get_order_history: async (req, res) => {
    try {
      const { _id } = req.auth_user;
      const order_history = await orders_repo.get_order_history_repo(_id);
      res.status(200).json(order_history);
    }
    catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
