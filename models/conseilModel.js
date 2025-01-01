const { supabase } = require('../config/supabaseClient');

const createConseil = async (conseil) => {
  const { Code_Utilisateurs, Titre, Description, Theme } = conseil;
  const { data, error } = await supabase
    .from('Conseils')
    .insert([
      {
        Code_Utilisateurs,
        Titre,
        Description,
        Date: new Date().toISOString(),
        Theme,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Erreur lors de la création du conseil : ${error.message}`);
  }

  return data[0];
};

const getAllConseils = async () => {
  const { data, error } = await supabase.from('Conseils').select('*');

  if (error) {
    throw new Error(`Erreur lors de la récupération des conseils : ${error.message}`);
  }

  return data;
};

const deleteConseil = async (conseilId) => {
  const { error } = await supabase.from('Conseils').delete().eq('Code_Conseils', conseilId);

  if (error) {
    throw new Error(`Erreur lors de la suppression du conseil : ${error.message}`);
  }

  return true;
};

const updateConseil = async (conseilId, updatedConseil) => {
  const { Titre, Description, Theme } = updatedConseil;
  const { error } = await supabase
    .from('Conseils')
    .update({ Titre, Description, Theme })
    .eq('Code_Conseils', conseilId);

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du conseil : ${error.message}`);
  }

  return true;
};

module.exports = {
  createConseil,
  getAllConseils,
  deleteConseil,
  updateConseil,
};
