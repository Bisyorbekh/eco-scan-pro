const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const QrCode = require("../models/QrCode");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const MonthlyProgress = require("../models/MonthlyProgress");
const monthKey = require("../utils/monthKey");


router.post("/", auth(), async (req, res) => {
  const { qrCode, walletType } = req.body;
  if (!qrCode || !walletType)
    return res.status(400).json({ message: "qrCode & walletType required" });

  const qr = await QrCode.findOne({ code: qrCode, isActive: true });
  if (!qr) return res.status(404).json({ message: "QR not found/inactive" });

  let wallet = await Wallet.findOne({ userId: req.user.id });
  if (!wallet) wallet = await Wallet.create({ userId: req.user.id });

  if (wallet.balances[walletType] === undefined)
    return res.status(400).json({ message: "Invalid walletType" });

  wallet.balances[walletType] += qr.rewardAmount;
  await wallet.save();
  let prog = await MonthlyProgress.findOne({ userId: req.user.id, month: monthKey() });
  if (!prog) prog = await MonthlyProgress.create({ userId: req.user.id, month: monthKey() });

  await Transaction.create({
    userId: req.user.id,
    type: "scan_reward",
    amount: qr.rewardAmount,
    walletType,
    qrCode,
    note: `${qr.binType} | ${qr.locationName}`,
  });

  res.json({ ok: true, added: qr.rewardAmount, wallet });

prog.scans += 1;
await prog.save();

});

router.get("/", (req, res) => {
    res.json({ ok: true, msg: "Use POST /api/scan" });
  });
  
  module.exports = function monthKey() {
    return new Date().toISOString().slice(0, 7);
  };

  
  
  

module.exports = router;
