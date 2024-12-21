const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Route pour créer ou retrouver une conversation
router.post('/conversation', conversationController.createOrFindConversation);

// Route pour récupérer toutes les conversations d'un utilisateur
router.get('/conversations/:userId', conversationController.getConversations);

// Route pour sauvegarder un message dans une conversation
router.post('/conversation/message', conversationController.saveMessage);

module.exports = router;