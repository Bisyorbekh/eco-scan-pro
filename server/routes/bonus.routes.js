const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Settings = require("../models/Settings");
const MonthlyProgress = require("../models/MonthlyProgress");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const monthKey = require("../utils/monthKey");

// GET status
router.get("/status", auth(), async (req, res) => {
  const mk = monthKey();
  const s = await Settings.findOne();
  const monthlyBonus = s?.monthlyBonus ?? 10000;
  const targetScans = s?.monthlyTarget ?? 30;

  let prog = await MonthlyProgress.findOne({ userId: req.user.id, month: mk });
  if (!prog) prog = await MonthlyProgress.create({ userId: req.user.id, month: mk });

  res.json({
    month: mk,
    scans: prog.scans,
    targetScans,
    monthlyBonus,
    bonusClaimed: prog.bonusClaimed,
    eligible: prog.scans >= targetScans && !prog.bonusClaimed,
  });
});

// POST claim
router.post("/claim", auth(), async (req, res) => {
  const mk = monthKey();
  const s = await Settings.findOne();
  const monthlyBonus = s?.monthlyBonus ?? 10000;
  const targetScans = s?.monthlyTarget ?? 30;

  let prog = await MonthlyProgress.findOne({ userId: req.user.id, month: mk });
  if (!prog) prog = await MonthlyProgress.create({ userId: req.user.id, month: mk });

  if (prog.bonusClaimed) return res.status(400).json({ message: "Already claimed" });
  if (prog.scans < targetScans) return res.status(400).json({ message: "Target not reached" });

  let wallet = await Wallet.findOne({ userId: req.user.id });
  if (!wallet) wallet = await Wallet.create({ userId: req.user.id });

  // bonus qaysi walletga tushsin? hozircha transportga
  wallet.balances.transport += monthlyBonus;
  await wallet.save();

  prog.bonusClaimed = true;
  await prog.save();

  await Transaction.create({
    userId: req.user.id,
    type: "monthly_bonus",
    amount: monthlyBonus,
    walletType: "transport",
    note: `Monthly bonus for ${mk}`,
  });

  res.json({ ok: true, added: monthlyBonus, wallet });
});

module.exports = router;
