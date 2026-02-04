const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true }, // masalan: BIN_0001
    rewardAmount: { type: Number, default: 1000 },        // admin belgilaydi
    isActive: { type: Boolean, default: true },
    binType: { type: String, default: "mixed" },          // plastic/paper/metal/mixed
    locationName: { type: String, default: "" },          // "Chilonzor 5"
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrCode", qrCodeSchema);
