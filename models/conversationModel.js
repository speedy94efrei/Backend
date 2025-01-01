const { supabase } = require('../config/supabaseClient');

const Conversation = {
  findOrCreateConversation: async (ownerId, expediteurId, callback) => {
    try {
      // Étape 1 : Vérifier si la conversation existe déjà
      const { data: existingConversation, error: checkError } = await supabase
        .from('Conversation') // Nom de votre table
        .select('Code_Conversation')
        .or(
          `Code_Expediteur.eq.${ownerId},Code_Destinataire.eq.${expediteurId},Code_Expediteur.eq.${expediteurId},Code_Destinataire.eq.${ownerId}`
        )
        .single(); // Retourne une seule ligne s'il y a une correspondance

      if (checkError && checkError.code !== 'PGRST116') {
        // Erreur autre que "not found" (PGRST116 = pas de résultats)
        console.error('Erreur lors de la vérification de la conversation :', checkError);
        return callback(checkError, null);
      }

      if (existingConversation) {
        // Si une conversation existe, la renvoyer
        return callback(null, { Code_Conversation: existingConversation.Code_Conversation });
      }

      // Étape 2 : Créer une nouvelle conversation
      const { data: newConversation, error: insertError } = await supabase
        .from('Conversation')
        .insert([
          {
            DateDebut: new Date().toISOString(), // Timestamp actuel
            DateFin: new Date().toISOString(), // Peut être mis à jour plus tard
            Code_Expediteur: expediteurId,
            Code_Destinataire: ownerId,
          },
        ])
        .select(); // Retourne les données insérées

      if (insertError) {
        console.error('Erreur lors de la création de la conversation :', insertError);
        return callback(insertError, null);
      }

      // Renvoyer l'ID de la nouvelle conversation
      callback(null, { Code_Conversation: newConversation[0].Code_Conversation });
    } catch (err) {
      console.error('Erreur inattendue :', err.message);
      callback(err, null);
    }
  },
};

module.exports = Conversation;
