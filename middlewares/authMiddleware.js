const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Je récupère le token

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' }); // Aucun token, accès refusé
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide.' }); // Token invalide
        }
        req.userId = decoded.userId; // J'associe l'ID utilisateur au token validé
        next(); // Je passe au middleware suivant
    });
};

module.exports = authenticateToken;