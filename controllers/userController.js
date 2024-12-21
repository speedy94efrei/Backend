const { getUserById, updateUserPassword, getUserInfoFromDb, updateUserPhoto, getUserPhoto, isUserBotanist } = require('../models/userModel');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const getUserInfo = (req, res) => {
  const userId = req.userId;

  getUserInfoFromDb(userId, (err, userInfo) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des informations utilisateur' });
    }

    if (!userInfo) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ nom: userInfo.nom, prenom: userInfo.prenom });
  });
};

const changePassword = (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  getUserById(userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la comparaison des mots de passe' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
      }

      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors du hachage du nouveau mot de passe' });
        }

        updateUserPassword(userId, hash, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe' });
          }
          res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
        });
      });
    });
  });
};

const verifyPassword = (req, res) => {
  const userId = req.userId;
  const { currentPassword } = req.body;

  getUserById(userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la comparaison des mots de passe' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
      }

      res.status(200).json({ message: 'Mot de passe vérifié avec succès' });
    });
  });
};

const updateUserProfilePic = async (req, res) => {
  const userId = req.userId;
  const photoBuffer = req.file.buffer;
  const fileName = `${uuidv4()}.webp`;
  const filePath = path.join(__dirname, '../uploads', fileName);

  try {
    await sharp(photoBuffer)
      .webp({ quality: 80 })
      .toFile(filePath);

    updateUserPhoto(userId, fileName, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la photo de profil' });
      }
      res.status(200).json({ message: 'Photo de profil mise à jour avec succès', fileName });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la conversion de l\'image' });
  }
};

const getUserProfilePic = (req, res) => {
  const userId = req.userId;

  getUserPhoto(userId, (err, fileName) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de la photo de profil' });
    }

    if (!fileName) {
      return res.status(404).json({ error: 'Photo de profil non trouvée' });
    }

    const filePath = path.join(__dirname, '../uploads', fileName);

    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'image/webp');
      res.status(200).sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Photo de profil non trouvée' });
    }
  });
};

const checkIfBotanist = (req, res) => {
  const userId = req.userId;

  isUserBotanist(userId, (err, isBotanist) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la vérification du statut de botaniste' });
    }

    if (isBotanist === null) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ isBotanist: isBotanist === 1 });
  });
};

module.exports = {
  getUserInfo,
  changePassword,
  verifyPassword,
  updateUserProfilePic,
  getUserProfilePic,
  checkIfBotanist, 
};
