const mongoose = require("mongoose");

const txSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["scan_reward", "monthly_bonus", "redeem"], required: true },
    amount: { type: Number, required: true },
    walletType: { type: String, default: "" }, // transport/paynet/...
    qrCode: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", txSchema);
