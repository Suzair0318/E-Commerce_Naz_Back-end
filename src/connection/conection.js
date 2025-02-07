const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_SRC)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));