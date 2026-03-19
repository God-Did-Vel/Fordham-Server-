import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// AFTER - Add these timeout options:
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,      
    socketTimeoutMS: 30000,               
    connectTimeoutMS: 10000,             
    retryWrites: true,
    w: 'majority'
});

export default connectDB;