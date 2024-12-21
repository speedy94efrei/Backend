const { db } = require('../config/db');

const createConseil = (conseil, callback) => {
  const { Code_Utilisateurs, Titre, Description, Theme } = conseil;
  const sql = `
    INSERT INTO Conseils (Code_Utilisateurs, Titre, Description, Date, Theme) 
    VALUES (?, ?, ?, ?, ?);
  `;
  const params = [Code_Utilisateurs, Titre, Description, new Date().toISOString(), Theme];

  db.run(sql, params, function(err) {
    if (err) {
      return callback(err);
    }
    const conseilId = this.lastID;
    callback(null, { Code_Conseils: conseilId, ...conseil, Date: new Date().toISOString() });
  });
};

const getAllConseils = (callback) => {
  const sql = 'SELECT * FROM Conseils';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
};

const deleteConseil = (conseilId, callback) => {
  const sql = 'DELETE FROM Conseils WHERE Code_Conseils = ?';
  db.run(sql, [conseilId], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

const updateConseil = (conseilId, updatedConseil, callback) => {
  const { Titre, Description, Theme } = updatedConseil;
  const sql = `
    UPDATE Conseils
    SET Titre = ?, Description = ?, Theme = ?
    WHERE Code_Conseils = ?;
  `;
  const params = [Titre, Description, Theme, conseilId];

  db.run(sql, params, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};

module.exports = {
  createConseil,
  getAllConseils,
  deleteConseil,
  updateConseil, 
};
