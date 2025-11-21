require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const pasteurRoutes = require('./routes/pasteurRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const tarankiLevyRoutes = require('./routes/tarankiLevyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Présence Pasteurs - Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      pasteurs: '/api/pasteurs',
      evenements: '/api/evenements',
      presences: '/api/presences',
      taranki_levy: '/api/taranki-levy'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/pasteurs', pasteurRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/presences', presenceRoutes);
app.use('/api/taranki-levy', tarankiLevyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('❌ Impossible de démarrer le serveur sans connexion à la base de données');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📚 Documentation API disponible sur: http://localhost:${PORT}\n`);
  });
};

startServer();

module.exports = app;

