import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import path from 'path'

dotenv.config();
// cloudinary
import("./config/cloudinary.js").catch((err) => {
  console.error("Failed to load Cloudinary config:", err);
});

// db
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send("API is working");
});

// api routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


// serve frontend
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "client", "dist", "index.html")
  );
});

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


