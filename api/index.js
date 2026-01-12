import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

// cloudinary
import("./config/cloudinary.js").catch((err) => {
  console.error("Failed to load Cloudinary config:", err);
});

// DB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// allowed origins (comma-separated in env)
const allowedOrigins = process.env.CLIENT_URL?.split(",");

// middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // 👈 allows cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());

// helper function to set cookies safely
export const setCookie = (res, name, value, options = {}) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-origin safe
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...options,
  };
  res.cookie(name, value, cookieOptions);
};

// test route
app.get("/test", (req, res) => {
  res.send("API is working");
});

// api routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// dynamic port for Render / local dev
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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