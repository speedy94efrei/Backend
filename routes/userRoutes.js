const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticateToken = require('../middlewares/authMiddleware');
const { getUserInfo, changePassword, verifyPassword, updateUserProfilePic, getUserProfilePic, checkIfBotanist } = require('../controllers/userController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/user-info', authenticateToken, getUserInfo);
router.post('/change-password', authenticateToken, changePassword);
router.post('/verify-password', authenticateToken, verifyPassword);
router.post('/upload-profile-pic', authenticateToken, upload.single('profilePic'), updateUserProfilePic);
router.get('/profile-pic', authenticateToken, getUserProfilePic);
router.get('/is-botanist', authenticateToken, checkIfBotanist);

module.exports = router;
