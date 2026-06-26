import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://127.0.0.1:27017/rentaloutdoor";

const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log("Database Lokal Terhubung!");
  } catch (error) {
    console.error("Gagal konek ke database:", error);
  }
};

export default connectMongoDB;