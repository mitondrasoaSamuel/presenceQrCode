# Backend API - Présence Pasteurs QR Code

Backend Express.js avec MySQL pour l'application de gestion de présences par QR Code.

## 🚀 Installation

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configurer MySQL
```bash
# Créer la base de données
mysql -u root -p < database/schema.sql
```

### 3. Configurer les variables d'environnement
Copier `.env.example` vers `.env` et modifier les valeurs:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=presence_pasteurs
JWT_SECRET=votre_secret_jwt
PORT=3000
```

### 4. Importer les données CSV
```bash
npm run import-csv
```

### 5. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Pasteurs
- `GET /api/pasteurs` - Liste des pasteurs
- `GET /api/pasteurs/:id` - Détails d'un pasteur
- `GET /api/pasteurs/search/:matricule` - Recherche par matricule
- `GET /api/pasteurs/:matricule/qrcode` - Générer QR code
- `POST /api/pasteurs` - Créer un pasteur
- `PUT /api/pasteurs/:id` - Modifier un pasteur
- `DELETE /api/pasteurs/:id` - Supprimer un pasteur

### Événements
- `GET /api/evenements` - Liste des événements
- `GET /api/evenements/disponibles` - Événements disponibles
- `GET /api/evenements/:id` - Détails d'un événement
- `POST /api/evenements` - Créer un événement
- `PUT /api/evenements/:id` - Modifier un événement
- `PUT /api/evenements/:id/statut` - Changer le statut
- `DELETE /api/evenements/:id` - Supprimer un événement

### Présences (QR Code)
- `POST /api/presences/:evenement_id/scan` - Scanner QR code
- `POST /api/presences/:evenement_id/manuel` - Ajout manuel
- `GET /api/presences/evenement/:id` - Liste des présents
- `GET /api/presences/evenement/:id/stats` - Statistiques
- `GET /api/presences/evenement/:id/absents` - Liste des absents
- `GET /api/presences/pasteur/:id` - Historique d'un pasteur
- `DELETE /api/presences/:id` - Supprimer une présence

## 🔐 Authentification

Toutes les routes (sauf `/api/auth/login` et `/api/auth/register`) nécessitent un token JWT dans le header:

```
Authorization: Bearer votre_token_jwt
```

## 📱 Compte admin par défaut

```
Email: admin@presence.mg
Mot de passe: admin123
```

**⚠️ À changer en production !**

