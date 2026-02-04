const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

router.get("/", auth(), async (req, res) => {
  let wallet = await Wallet.findOne({ userId: req.user.id });
  if (!wallet) wallet = await Wallet.create({ userId: req.user.id });
  res.json(wallet);
});

router.get("/transactions", auth(), async (req, res) => {
  const tx = await Transaction.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(tx);
});

module.exports = router;
