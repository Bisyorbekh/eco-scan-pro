const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "eco-scan",
    });
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
