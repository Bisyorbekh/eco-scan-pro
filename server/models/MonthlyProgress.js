const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // "YYYY-MM"
    scans: { type: Number, default: 0 },
    bonusClaimed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MonthlyProgress", schema);
