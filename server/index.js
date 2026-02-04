require("dotenv").config();
const express = require("express");
const allowed = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);


const connectDB = require("./config/db");

const app = express();

console.log("MONGO_URI loaded?", !!process.env.MONGO_URI);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true); // postman/curl
      if (allowed.length === 0) return cb(null, true); // agar env berilmagan bo'lsa
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/scan", require("./routes/scan.routes"));
app.use("/api/wallet", require("./routes/wallet.routes"));
app.use("/api/bonus", require("./routes/bonus.routes"));
app.use("/api/pay", require("./routes/pay.routes"));



app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "eco-scan" });
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log("API running → http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.error("DB connect failed:", err.message);
    process.exit(1);
  });
