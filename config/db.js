const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB:', process.env.MONGO_URI);

        // Use mongoose.connect instead of createConnection
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

// Reusable function to switch databases
const useDatabase = (dbName) => {
    // Use the default mongoose.connection to switch databases
    return mongoose.connection.useDb(dbName, { useCache: true });
};

module.exports = {
    connectDB,
    useDatabase,
};
