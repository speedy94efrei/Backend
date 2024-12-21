const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { initialize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const annonceRoutes = require('./routes/annonceRoutes');
const userRoutes = require('./routes/userRoutes');
const conseilRoutes = require('./routes/conseilRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const multer = require('multer');

const app = express();
const port = 3000;

// Initialisation de la base de données
initialize();

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:8081', // Remplace par l'origine de ton frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

app.use(cors(corsOptions));
app.use(morgan('combined'));

// Configurer body-parser pour accepter des payloads plus grands
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configuration de multer pour accepter des fichiers plus grands
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Routes
app.use('/auth', authRoutes);
app.use('/annonces', annonceRoutes);
app.use('/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/conseils', conseilRoutes);
app.use('/api', conversationRoutes);

app.listen(port, () => {
  console.log(`Serveur API démarré sur le port ${port}`);
});

module.exports = app;
