import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, uploadListingImages } from "../controllers/listing.controller.js";
import parser from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", verifyToken, createListing );

// upload listing images (max 6)
router.post("/upload-images", verifyToken, parser.array("images", 6), uploadListingImages);

export default router;