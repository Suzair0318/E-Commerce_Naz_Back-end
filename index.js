// app.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
let a = 'suzair';

// Export app for server.js
app.listen(3000 , () => console.log('Hello, Express'))
