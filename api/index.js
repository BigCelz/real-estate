import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

// load env
dotenv.config();

// cloudinary (safe dynamic import)
import("./config/cloudinary.js").catch((err) => {
  console.error("Cloudinary config failed:", err);
});

// connect DB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const app = express();

// =======================
// MIDDLEWARES
// =======================

// parse json + cookies
app.use(express.json());
app.use(cookieParser());

// CORS (production-safe)
const allowedOrigins = process.env.CLIENT_URL?.split(",") || [];

app.use(
  cors({
    origin: true,  // allows all origins
    credentials: true
  })
);


// =======================
// COOKIE HELPER
// =======================

export const setCookie = (res, name, value, options = {}) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...options,
  });
};

// =======================
// ROUTES
// =======================

app.get("/test", (req, res) => {
  res.status(200).json({ message: "API is working 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// =======================
// GLOBAL ERROR HANDLER
// =======================

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});






// import path from 'path'

// const __dirname = path.resolve();

// serve frontend
// app.use(express.static(path.join(__dirname, "client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "client", "dist", "index.html")
//   );
// });