const { Schema, model } = require("mongoose");

const SettingsSchema = new Schema(
  {
    monthlyTarget: { type: Number, default: 30 },
    monthlyBonus: { type: Number, default: 10000 },
  },
  { timestamps: true }
);

module.exports = model("Settings", SettingsSchema);
