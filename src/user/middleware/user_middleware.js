
const jwt = require('jsonwebtoken');
const UserDB = require('../models/user_model');
require('dotenv').config();

// Protected Route (Example)
  const middleware =  async (req, res , next) => {
    try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token is not Provided' });
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
       if(!decoded) return res.status(401).json({ message: 'Token Expired'})
      const user = await UserDB.findById(decoded.id);
       req.auth_user = user;
       next();
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };

  const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
      next();
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };

   module.exports = { middleware, adminMiddleware };
