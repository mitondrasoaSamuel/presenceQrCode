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

// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines autorisées
    const allowedOrigins = [
      'http://localhost:8081',
      'http://localhost:3000',
      'http://localhost:19006',
      'http://localhost:19007',
      'http://192.168.88.4:8081',
      'http://192.168.88.4:3000',
      'https://crazy-albattani.185-209-228-202.plesk.page',
      'http://crazy-albattani.185-209-228-202.plesk.page',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:3000',
    ];

    // Accepter les requêtes sans origin (comme les requêtes mobiles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 heures
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pré-flight pour toutes les routes
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
      taranki_levy: '/api/taranki-levy',
    },
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
    message: 'Route non trouvée',
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const startServer = async () => {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error(
      '❌ Impossible de démarrer le serveur sans connexion à la base de données'
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(
      `\n📚 Documentation API disponible sur: http://localhost:${PORT}\n`
    );
  });
};

startServer();

module.exports = app;
