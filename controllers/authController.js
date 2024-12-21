const bcrypt = require('bcrypt');
const { createUser, getUserByEmail } = require('../models/authModel');
const { generateToken } = require('../utils/jwt'); 

const signup = async (req, res) => {
    const { name, surname, email, password, isBotanist } = req.body;
    const botanistValue = isBotanist ? 1 : 0;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Je hash le mot de passe

        createUser(name, surname, email, hashedPassword, botanistValue, (err, userId) => {
            if (err) {
                console.error('Database insertion error:', err.message);
                return res.status(500).json({ error: 'Erreur lors de l\'insertion dans la base de données', details: err.message });
            }
            res.status(200).json({ message: 'Inscription réussie', userId });
        });
    } catch (err) {
        console.error('Error during signup:', err.message); // Log important pour déboguer l'inscription
        res.status(500).json({ error: 'Erreur lors de l\'inscription', details: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Je récupère l'utilisateur à partir de l'email
        getUserByEmail(email, async (err, user) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Erreur lors de la connexion à la base de données', details: err.message });
            }

            if (!user) {
                return res.status(400).json({ error: 'Email ou mot de passe incorrect' }); // Email non trouvé
            }

            try {
                // Je compare les mots de passe
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ error: 'Email ou mot de passe incorrect' }); // Mot de passe incorrect
                }

                const token = generateToken(user.Code_Utilisateurs); // Je génère un token
                res.status(200).json({ token });

            } catch (error) {
                console.error('Error during password comparison:', error.message); // Log en cas de problème avec bcrypt
                return res.status(500).json({ error: 'Erreur lors de la comparaison du mot de passe', details: error.message });
            }
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ error: 'Erreur lors de la connexion', details: error.message });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Déconnexion réussie' });
};

module.exports = {
    signup,
    login,
    logout
};
