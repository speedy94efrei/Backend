const Conseil = require('../models/conseilModel');

const createConseil = (req, res) => {
  const conseil = req.body;
  Conseil.createConseil(conseil, (err, newConseil) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(newConseil);
    }
  });
};

const getAllConseils = (req, res) => {
  Conseil.getAllConseils((err, conseils) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(conseils); // Renvoie la liste des conseils
    }
  });
};

const deleteConseil = (req, res) => {
  const { id } = req.params;
  Conseil.deleteConseil(id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(204).send();
    }
  });
};

const updateConseil = (req, res) => {
  const { id } = req.params;
  const updatedConseil = req.body;

  Conseil.updateConseil(id, updatedConseil, (err) => {
    if (err) {
      res.status(500).json({ error: err.message }); 
    } else {
      res.status(200).json({ message: 'Conseil mis à jour avec succès' });
    }
  });
};

module.exports = {
  createConseil,
  getAllConseils,
  deleteConseil,
  updateConseil, 
};