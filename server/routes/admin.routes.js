const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Settings = require("../models/Settings");
const QrCode = require("../models/QrCode");

/* ===== BONUS SETTINGS ===== */

// get settings
router.get("/settings", auth(["admin"]), async (req, res) => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({ monthlyBonus: 10000 });
  res.json(s);
});

// update monthly bonus
router.put("/settings/monthly-bonus", auth(["admin"]), async (req, res) => {
  const { monthlyBonus } = req.body;
  if (typeof monthlyBonus !== "number")
    return res.status(400).json({ msg: "monthlyBonus must be number" });

  let s = await Settings.findOne();
  if (!s) s = await Settings.create({ monthlyBonus });
  else {
    s.monthlyBonus = monthlyBonus;
    await s.save();
  }

  res.json({ msg: "Updated", monthlyBonus: s.monthlyBonus });
});

// update target + bonus (bitta joydan)
router.put("/settings", auth(["admin"]), async (req, res) => {
  const { monthlyBonus, monthlyTarget } = req.body;

  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});

  if (monthlyBonus !== undefined) {
    if (typeof monthlyBonus !== "number")
      return res.status(400).json({ msg: "monthlyBonus must be number" });
    s.monthlyBonus = monthlyBonus;
  }

  if (monthlyTarget !== undefined) {
    if (typeof monthlyTarget !== "number")
      return res.status(400).json({ msg: "monthlyTarget must be number" });
    s.monthlyTarget = monthlyTarget;
  }

  await s.save();
  res.json({ msg: "Updated", settings: s });
});


/* ===== QR MANAGEMENT ===== */

router.post("/qr", auth(["admin"]), async (req, res) => {
  const { code, rewardAmount, binType, locationName } = req.body;
  const qr = await QrCode.create({ code, rewardAmount, binType, locationName });
  res.json(qr);
});

// LIST QR
router.get("/qr", auth(["admin"]), async (req, res) => {
  const list = await QrCode.find().sort({ createdAt: -1 });
  res.json(list);
});

// TOGGLE active
router.patch("/qr/:id/toggle", auth(["admin"]), async (req, res) => {
  const qr = await QrCode.findById(req.params.id);
  qr.isActive = !qr.isActive;
  await qr.save();
  res.json(qr);
});


module.exports = router;
