import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createListing, deleteListing, getListing, getListings, updateListing, uploadListingImages } from "../controllers/listing.controller.js";
import parser from "../middlewares/upload.js";

const router = express.Router();


router.post("/create", verifyToken, parser.array("images", 6), createListing );

// upload listing images (max 6)
router.post("/upload-images", verifyToken, parser.array("images", 6), uploadListingImages);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing)
router.get('/get', getListings)

export default router;

// import express from "express";
// import { verifyToken } from "../utils/verifyUser.js";
// import { 
//   createListing, 
//   deleteListing, 
//   getListing, 
//   getListings, 
//   updateListing, 
//   uploadListingImages 
// } from "../controllers/listing.controller.js";
// import parser from "../middlewares/upload.js";

// const router = express.Router();

// router.post("/", verifyToken, parser.array("images", 6), createListing );
// // Upload images separately
// router.post("/upload-images", verifyToken, parser.array("images", 6), uploadListingImages);
// router.delete("/:id", verifyToken, deleteListing);
// router.put("/:id", verifyToken, updateListing);
// router.get("/:id", getListing);
// router.get("/", getListings);

// export default router;
