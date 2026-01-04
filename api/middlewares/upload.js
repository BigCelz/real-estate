import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

console.log("Cloudinary config:", cloudinary.config());


const storage = new CloudinaryStorage({
    
  cloudinary,
  params: {
    folder: "profile_pics",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

export default parser;
