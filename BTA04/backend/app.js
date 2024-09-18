const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Use the user routes
app.use('/users', userRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/reactnative');

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
