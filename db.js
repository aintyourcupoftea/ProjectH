const mongoose = require('mongoose');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://LogisticsAdmin:3qXjnj5kxgUqEyuh@logisticsproject.cttiw.mongodb.net/ProjectH'; // Change 'your_db_name' to your actual DB name

mongoose.connect(MONGO_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB : ProjectH');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err);
});



