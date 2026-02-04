const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Fill all fields" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ msg: "User exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // vaqtincha admin: email @admin.com bilan tugasa admin
    const role = email.toLowerCase().endsWith("@admin.com") ? "admin" : "user";

    await User.create({ name, email: email.toLowerCase(), passwordHash, role });
    res.json({ msg: "Registered" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, role: user.role, name: user.name });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
