require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() { 
    mongoose.connect(process.env.MONGODB_CONNECTION_URL)
            .then(() => {
                console.log('Database connection successfull.');
            })
            .catch(err => {
                console.log('Database connection failed');
            });
}

module.exports = connectDB;