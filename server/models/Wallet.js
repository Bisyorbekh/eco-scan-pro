const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    balances: {
      transport: { type: Number, default: 0 },
      paynet: { type: Number, default: 0 },
      supermarket: { type: Number, default: 0 },
      ebook: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
