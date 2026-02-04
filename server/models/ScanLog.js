const mongoose = require("mongoose");

const scanLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    qrCode: { type: String, required: true },
  },
  { timestamps: true }
);

scanLogSchema.index({ userId: 1, qrCode: 1, createdAt: -1 });

module.exports = mongoose.model("ScanLog", scanLogSchema);
