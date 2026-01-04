import express from 'express';
import { test, UploadProfilePic } from '../controllers/user.controller.js';
import parser from '../middlewares/upload.js';

const router = express.Router();


router.get('/test', test);
router.put("/profile-pic/:userId", parser.single("file"), UploadProfilePic);



export default router;