import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

/* ================= CONNECT DB ================= */

export const connectDB = async () => {
  try {
    // Prevent multiple connections in Next.js (important)
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGO_URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
    process.exit(1);
  }
};