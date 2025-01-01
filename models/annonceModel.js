const { supabase } = require('../config/supabaseClient');

const createAnnonce = async (annonce, callback) => {
  const { nomPlante, description, localisation, dateDebut, dateFin, photo, userId } = annonce;

  try {
    const { data: postData, error: postError } = await supabase
      .from('postes')
      .insert([
        {
          code_Utilisateurs: userId,
          titre: nomPlante,
          description,
          datePoste: new Date().toISOString(),
          localisation,
        },
      ])
      .select();

    if (postError) {
      return callback(postError, null);
    }

    const postId = postData[0]?.Code_Postes;

    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .insert([
        {
          date: new Date().toISOString(),
          photo,
          code_Utilisateurs: userId,
          code_Postes: postId,
        },
      ])
      .select();

    if (photoError) {
      return callback(photoError, null);
    }

    const photoId = photoData[0]?.Code_Photos;

    const { error: updatePostError } = await supabase
      .from('postes')
      .update({ code_Photos: photoId })
      .eq('Code_Postes', postId);

    if (updatePostError) {
      return callback(updatePostError, null);
    }

    const { error: gardeError } = await supabase
      .from('Gardes')
      .insert([
        {
          Code_Postes: postId,
          Code_Gardien: userId,
          Statut: 'Disponible',
          DateDebut: dateDebut,
          DateFin: dateFin,
        },
      ]);

    if (gardeError) {
      return callback(gardeError, null);
    }

    callback(null, postId);
  } catch (err) {
    callback(err, null);
  }
};

const getAllAnnonces = async (callback) => {
  try {
    const { data, error } = await supabase
      .from('postes')
      .select(`
        Code_Postes, titre, description, datePoste, localisation, 
        photos(photo), 
        Gardes(DateDebut, DateFin)
      `)
      .order('datePoste', { ascending: false });

    if (error) {
      return callback(error, null);
    }

    const annonces = data.map((row) => ({
      ...row,
      dateDebut: row.Gardes?.DateDebut ? new Date(row.Gardes.DateDebut).toISOString() : null,
      dateFin: row.Gardes?.DateFin ? new Date(row.Gardes.DateFin).toISOString() : null,
    }));

    callback(null, annonces);
  } catch (err) {
    callback(err, null);
  }
};

const getAnnoncesByUser = async (userId, callback) => {
  try {
    const { data, error } = await supabase
      .from('postes')
      .select(`
        Code_Postes, titre, description, datePoste, localisation, 
        photos(photo), 
        Gardes(DateDebut, DateFin)
      `)
      .eq('code_Utilisateurs', userId)
      .order('datePoste', { ascending: false });

    if (error) {
      return callback(error, null);
    }

    const annonces = data.map((row) => ({
      ...row,
      dateDebut: row.Gardes?.DateDebut ? new Date(row.Gardes.DateDebut).toISOString() : null,
      dateFin: row.Gardes?.DateFin ? new Date(row.Gardes.DateFin).toISOString() : null,
    }));

    callback(null, annonces);
  } catch (err) {
    callback(err, null);
  }
};

// Export des fonctions dans le format concis
module.exports = {
  createAnnonce,
  getAllAnnonces,
  getAnnoncesByUser,
};
