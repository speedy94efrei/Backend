const { db } = require('../config/db');
const Conversation = require('../models/conversationModel');

// Fonction pour créer ou retrouver une conversation
exports.createOrFindConversation = (req, res) => {
  const { ownerId, expediteurId } = req.body;

  const queryCheck = `
    SELECT * FROM Conversation 
    WHERE (Code_Expediteur = ? AND Code_Destinataire = ?) 
    OR (Code_Expediteur = ? AND Code_Destinataire = ?)
  `;

  db.get(queryCheck, [ownerId, expediteurId, expediteurId, ownerId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de la conversation' });
    }

    if (row) {
      // Renvoie la conversation existante
      res.json({ conversationId: row.Code_Conversation });
    } else {
      // Crée une nouvelle conversation si elle n'existe pas
      const insertQuery = `
        INSERT INTO Conversation (DateDebut, DateFin, Code_Expediteur, Code_Destinataire)
        VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)
      `;
      db.run(insertQuery, [ownerId, expediteurId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
        }
        res.json({ conversationId: this.lastID });
      });
    }
  });
};

// Fonction pour récupérer toutes les conversations pour un utilisateur donné
exports.getConversations = (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT * FROM Conversation 
    WHERE Code_Expediteur = ? OR Code_Destinataire = ?
  `;

  db.all(query, [userId, userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
    }
    res.json(rows);
  });
};

// Fonction pour sauvegarder un message dans la table Messages
exports.saveMessage = (req, res) => {
  const { message, conversationId, userId } = req.body;
  console.log("Données reçues pour le message :", { message, conversationId, userId });

  const query = `
    INSERT INTO Messages (Message, Code_Conversation, Code_Utilisateurs)
    VALUES (?, ?, ?)
  `;

  db.run(query, [message, conversationId, userId], function(err) {
    if (err) {
      console.error("Erreur SQL lors de l'insertion du message :", err);
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde du message' });
    }
    console.log("ID du message inséré :", this.lastID);
    res.json({ messageId: this.lastID });
  });
};
