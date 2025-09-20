require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase"); // ✅ use Supabase instead of MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (
  process.env.FRONTEND_ORIGINS ||
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    const allowAll =
      process.env.CORS_ALLOW_ALL === "true" || allowedOrigins.includes("*");
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    const isProd = process.env.NODE_ENV === "production";
    if (
      !isProd &&
      (/^http:\/\/localhost:\d+/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+/.test(origin))
    ) {
      return callback(null, true);
    }
    if (allowAll || allowedOrigins.includes(origin))
      return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/colleges", require("./routes/colleges"));

app.get("/", (req, res) =>
  res.send({ ok: true, message: "Backend is running" })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
