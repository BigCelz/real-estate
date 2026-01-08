import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, deleteListing, updateListing, uploadListingImages } from "../controllers/listing.controller.js";
import parser from "../middlewares/upload.js";

const router = express.Router();


router.post("/create", verifyToken, parser.array("images", 6), createListing );

// upload listing images (max 6)
router.post("/upload-images", verifyToken, parser.array("images", 6), uploadListingImages);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateListing)

export default router;