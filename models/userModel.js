const { supabase } = require('../config/supabaseClient');

// Fonction pour récupérer un utilisateur par ID
const getUserById = async (userId, callback) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('*')
      .eq('Code_Utilisateurs', userId)
      .single(); // single() pour s'assurer qu'une seule ligne est retournée

    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      return callback(error, null);
    }
    callback(null, data);
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    callback(err, null);
  }
};

// Fonction pour récupérer uniquement les champs nom et prenom
const getUserInfoFromDb = async (userId, callback) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('nom, prenom')
      .eq('Code_Utilisateurs', userId)
      .single();

    if (error) {
      return callback(error, null);
    }
    return callback(null, data || null);
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    return callback(err, null);
  }
};

// Fonction pour mettre à jour le mot de passe
const updateUserPassword = async (userId, hashedPassword, callback) => {
  try {
    const { error } = await supabase
      .from('utilisateurs')
      .update({ password: hashedPassword })
      .eq('Code_Utilisateurs', userId);

    if (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error);
      return callback(error);
    }
    callback(null); // Succès
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    return callback(err);
  }
};

// Fonction pour mettre à jour la photo d'un utilisateur
const updateUserPhoto = async (id, fileName, callback) => {
  try {
    const { error } = await supabase
      .from('utilisateurs')
      .update({ photo: fileName })
      .eq('Code_Utilisateurs', id);

    if (error) {
      console.error('Erreur lors de la mise à jour de la photo :', error);
      return callback(error);
    }
    callback(null); // Succès
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    return callback(err);
  }
};

// Fonction pour récupérer la photo d'un utilisateur
const getUserPhoto = async (id, callback) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('photo')
      .eq('Code_Utilisateurs', id)
      .single();

    if (error) {
      return callback(error, null);
    }
    callback(null, data ? data.photo : null);
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    return callback(err, null);
  }
};

// Fonction pour vérifier si un utilisateur est botaniste
const isUserBotanist = async (userId, callback) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs')
      .select('botaniste')
      .eq('Code_Utilisateurs', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération du statut de botaniste :', error);
      return callback(error, null);
    }
    callback(null, data ? data.botaniste : null);
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
    callback(err, null);
  }
};

module.exports = {
  getUserById,
  updateUserPassword,
  getUserInfoFromDb,
  updateUserPhoto,
  getUserPhoto,
  isUserBotanist,
};
