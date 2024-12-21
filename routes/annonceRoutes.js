const express = require('express');
const { addAnnonce, getAllAnnonces, getAnnonceImage, getAnnoncesByUser } = require('../controllers/annonceController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.post('/addannonce', authenticateToken, upload.single('photo'), addAnnonce);
router.get('/all', authenticateToken, getAllAnnonces);
router.get('/image/:filename', getAnnonceImage);
router.get('/myannonces', authenticateToken, getAnnoncesByUser); // Route pour récupérer les annonces de l'utilisateur

module.exports = router;
