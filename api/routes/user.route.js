import express from 'express';
import { test, updateUser, UploadProfilePic } from '../controllers/user.controller.js';
import parser from '../middlewares/upload.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test', test);
router.put("/profile-pic/:userId", parser.single("file"), UploadProfilePic);
router.post('/update/:id', verifyUser, updateUser);



export default router;