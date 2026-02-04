const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// QR format: PAY|walletType|amount|merchantName
// example: PAY|transport|1200|Toshkent Metro

router.post("/", auth(), async (req, res) => {
  const { payload } = req.body;
  if (!payload) return res.status(400).json({ message: "payload required" });

  const parts = String(payload).split("|");
  if (parts.length < 4 || parts[0] !== "PAY")
    return res.status(400).json({ message: "Invalid PAY QR" });

  const walletType = parts[1];
  const amount = Number(parts[2]);
  const merchantName = parts.slice(3).join("|"); // agar ichida | bo'lsa ham

  if (!Number.isFinite(amount) || amount <= 0)
    return res.status(400).json({ message: "Invalid amount" });

  let wallet = await Wallet.findOne({ userId: req.user.id });
  if (!wallet) wallet = await Wallet.create({ userId: req.user.id });

  if (wallet.balances[walletType] === undefined)
    return res.status(400).json({ message: "Invalid walletType" });

  if (wallet.balances[walletType] < amount)
    return res.status(400).json({ message: "Not enough balance" });

  wallet.balances[walletType] -= amount;
  await wallet.save();

  await Transaction.create({
    userId: req.user.id,
    type: "redeem",
    amount: -amount, // minus ko'rinsin
    walletType,
    note: `Paid to ${merchantName}`,
  });

  res.json({ ok: true, paid: amount, walletType, merchantName, wallet });
});

module.exports = router;
