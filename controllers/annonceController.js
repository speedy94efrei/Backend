const fs = require('fs');
const path = require('path');
const annonceModel = require('../models/annonceModel');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const addAnnonce = async (req, res) => {
  const annonce = req.body;
  annonce.userId = req.userId; // J'associe l'annonce à l'utilisateur

  if (!req.file) {
    return res.status(400).json({ error: 'Image non fournie' });
  }

  const photoBuffer = req.file.buffer;
  const fileName = `${uuidv4()}.webp`; // Faut générer un nom unique pour l'image
  const filePath = path.join(__dirname, '../uploads/plante', fileName);

  try {
    await sharp(photoBuffer)
      .webp({ quality: 80 })
      .toFile(filePath);

    annonce.photo = fileName;

    annonceModel.createAnnonce(annonce, (err, id) => {
      if (err) {
        console.error('Database error:', err.message); // Je garde ce log pour les erreurs critiques
        return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'annonce' });
      }
      res.status(201).json({ message: 'Annonce ajoutée avec succès', id });
    });
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image:', error); // Log important en cas de bug
    res.status(500).json({ error: 'Erreur lors de la conversion de l\'image' });
  }
};

const getAllAnnonces = (req, res) => {
  annonceModel.getAllAnnonces((err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
    }
    res.status(200).json(rows); 
  });
};

const getAnnonceImage = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/plante', filename);

  if (fs.existsSync(filePath)) {
    try {
      const imageBuffer = await sharp(filePath).toBuffer();
      res.setHeader('Content-Type', 'image/webp');
      res.status(200).send(imageBuffer);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error); 
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'image' });
    }
  } else {
    console.error(`Image non trouvée: ${filePath}`);
    res.status(404).json({ error: 'Image non trouvée' });
  }
};

const getAnnoncesByUser = (req, res) => {
  const userId = req.userId;

  annonceModel.getAnnoncesByUser(userId, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Erreur lors de la récupération des annonces' });
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  addAnnonce,
  getAllAnnonces,
  getAnnonceImage,
  getAnnoncesByUser,
};