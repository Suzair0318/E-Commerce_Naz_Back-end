const admin_order_services = require('../services/admin_order_services');

module.exports =  {
     get_orders : async (req, res) => {
        try {
            const orders = await admin_order_services.get_admin_orders_service();
            res.status(200).json(orders);
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch orders', error });
        }
    },
    get_orders_id : async (req, res) => {
        try {
            const orders = await admin_order_services.get_admin_orders_id_service(req.params.id);
            res.status(200).json({ orders });
        } catch (error) {
            res.status(400).json({ message: 'Failed to fetch orders', error });
        }
    },
    filter_orders : async(req , res) => {
        try{
           const orders = await admin_order_services.filter_admin_orders_service(req.body);
           res.status(200).json(orders);
        }
        catch(error){
            res.status(400).json({ message: error.message });
        }
    },
    get_weekly_orders_stats : async(req , res) => {
        try{
          const stats = await admin_order_services.get_weekly_orders_stats_service();
          res.status(200).json(stats);
        }
        catch(e){
            res.status(400).json({ message: e.message });
        }
    }
}