const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const timeoutMs = 3500;

  try {
    console.log(`Attempting MongoDB connection to: ${process.env.MONGO_URI}`);

    // Race mongoose.connect against a timeout
    const connectPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Connection timed out while resolving host / DNS.')),
        timeoutMs
      )
    );

    const conn = await Promise.race([connectPromise, timeoutPromise]);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Primary Atlas connection failed: ${error.message}`);
    console.log('Activating local In-Memory MongoDB instance for seamless operation...');

    try {
      // Disconnect any hanging attempt on the default mongoose connection
      try {
        await mongoose.disconnect();
      } catch (discErr) {
        // ignore
      }

      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'campussync',
        },
      });
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB In-Memory Server Active & Connected: ${memoryUri}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`Failed to start fallback in-memory MongoDB: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
