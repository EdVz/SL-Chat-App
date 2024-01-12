const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log('Database Connected');
    } catch (error) {
        console.log(`Databse Connection Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;