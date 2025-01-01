const { supabase } = require('../config/supabaseClient');

// Fonction pour insérer un utilisateur
const createUser = async (name, surname, email, hashedPassword, botanistValue, callback) => {
    try {
        // Requête d'insertion avec Supabase
        const { data, error } = await supabase
            .from('Utilisateurs') // Nom de votre table Supabase
            .insert([
                {
                    nom: name,
                    prenom: surname,
                    email: email,
                    password: hashedPassword,
                    botaniste: botanistValue,
                },
            ]);

        if (error) {
            console.error('Erreur lors de l\'insertion :', error);
            callback(error, null);
        } else {
            console.log('Utilisateur inséré avec succès :', data);
            callback(null, data[0]?.Code_Utilisateurs || data[0]?.id); // Retourne l'ID inséré
        }
    } catch (err) {
        console.error('Erreur inattendue :', err.message);
        callback(err, null);
    }
};

// Fonction pour récupérer un utilisateur par email
const getUserByEmail = async (email, callback) => {
    try {
        // Requête de sélection avec Supabase
        const { data, error } = await supabase
            .from('Utilisateurs') // Nom de votre table Supabase
            .select('*')
            .eq('email', email)
            .single(); // .single() pour récupérer une seule ligne

        if (error) {
            console.error('Erreur lors de la récupération :', error);
            callback(error, null);
        } else {
            console.log('Utilisateur récupéré :', data);
            callback(null, data);
        }
    } catch (err) {
        console.error('Erreur inattendue :', err.message);
        callback(err, null);
    }
};

module.exports = {
    createUser,
    getUserByEmail,
};
