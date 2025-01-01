const { supabase } = require('./config/supabaseClient'); // Assurez-vous que le chemin est correct

const testSelect = async () => {
  try {
    // Effectuer un SELECT sur la table utilisateurs
    const { data, error } = await supabase
      .from('utilisateurs') // Nom de votre table
      .select('*'); // Sélectionnez toutes les colonnes

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    } else {
      console.log('Données récupérées avec succès :', data);
    }
  } catch (err) {
    console.error('Erreur inattendue :', err.message);
  }
};

// Appeler la fonction
testSelect();
