import express from 'express';
import { deleteUser, test, updateUser, UploadProfilePic } from '../controllers/user.controller.js';
import parser from '../middlewares/upload.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();


router.get('/test', test);
router.put("/profile-pic/:userId", parser.single("file"), UploadProfilePic);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);



export default router;