const Order = require('../../../client/orders/models/orders_models');
const moment = require('moment');

module.exports = {
  
  get_admin_orders_service: async () => {
      return await Order.find({})
        .populate('userId', 'name')
        .populate('products.productId');
  },

  get_admin_orders_id_service: async (params_id) => {
      return await Order.findById({ _id: params_id })
        .populate('userId', 'name email')
        .populate('products.productId');
  },
  
  filter_admin_orders_service: async (body) => {
      const { start_date, end_date, order_id } = body;
      const filter = {};

      // Check if order_id is provided (can be order ID or username)
      if (order_id) {
        const isObjectId = /^[a-f\d]{24}$/i.test(order_id); // Check if it's a valid MongoDB ObjectId
        if (isObjectId) {
          filter._id = order_id; // Filter by order ID
        }
      }

      // Filter by date range (start_date and end_date)
      if (start_date || end_date) {
        filter.createdAt = {};
        if (start_date) {
          filter.createdAt.$gte = new Date(start_date); // Greater than or equal to start_date
        }
        if (end_date) {
          filter.createdAt.$lte = new Date(end_date); // Less than or equal to end_date
        }
      }

      // Fetch orders with filters and populate data
      let orders = await Order.find(filter)
        .populate({
          path: 'userId',
          select: 'name', // Fetch only the `name` field
          match: order_id && !filter._id ? { name: { $regex: order_id, $options: 'i' } } : {}, // Filter by username if not order ID
        })
        .populate('products.productId'); // Populate products

      // Remove orders where `userId` doesn't match `name` filter
      if (order_id && !filter._id) {
        orders = orders.filter(order => order.userId !== null);
      }

      return orders;
  },

  get_weekly_orders_stats_service: async () => {
   

      const startOfLastMonth = moment().startOf("month").toDate(); // Start of previous month
      const endOfLastMonth = moment().endOf("month").toDate(); // End of previous month

      // Aggregate data to group by week
      const monthlyStats = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfLastMonth,
              $lte: endOfLastMonth,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" }, // Year of order
              month: { $month: "$createdAt" }, // Month of order
              week: { $isoWeek: "$createdAt" }, // Weekly breakdown
            },
            totalOrders: { $sum: 1 }, // Count total orders
            totalRevenue: { $sum: "$totalPrice" }, // Sum total revenue
          },
        },
        {
          $sort: { "_id.week": 1 }, // Sort by week number within the month
        },
      ]);

      // Overall stats
      const overallStats = await Order.aggregate([
        {
          $group: {
            _id: null, // Group everything
            totalOrders: { $sum: 1 }, // Count total orders
            totalRevenue: { $sum: "$totalPrice" }, // Sum total revenue
          },
        },
      ]);

      // Format the data for the frontend
      const formattedData = monthlyStats.map((stat) => ({
        week: stat._id.week,
        year: stat._id.year,
        totalOrders: stat.totalOrders,
        totalRevenue: stat.totalRevenue,
      }));

      return { success: true, monthly_data: formattedData, overall_data: overallStats };
  }
}