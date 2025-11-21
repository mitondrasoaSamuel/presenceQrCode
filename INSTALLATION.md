# 📦 Guide d'installation Backend

## Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Étapes d'installation

### 1. Installer les dépendances

```bash
cd backend
npm install
```

### 2. Configurer MySQL

#### Option A: Ligne de commande

```bash
mysql -u root -p

# Dans le prompt MySQL
CREATE DATABASE presence_pasteurs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Créer les tables
mysql -u root -p presence_pasteurs < database/schema.sql
```

#### Option B: phpMyAdmin ou autre outil graphique

1. Créer une nouvelle base de données nommée `presence_pasteurs`
2. Sélectionner l'encodage `utf8mb4_unicode_ci`
3. Importer le fichier `database/schema.sql`

### 3. Configurer les variables d'environnement

Le fichier `.env` est déjà créé. Modifier les valeurs selon votre configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=presence_pasteurs
DB_PORT=3306

JWT_SECRET=changez_ce_secret_en_production
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

⚠️ **Important**: Changez le `JWT_SECRET` en production !

### 4. Tester la connexion à la base de données

```bash
npm run dev
```

Vous devriez voir:
```
✅ Connexion MySQL réussie
🚀 Serveur démarré sur le port 3000
```

### 5. Importer les données des pasteurs depuis le CSV

```bash
npm run import-csv
```

Cette commande va lire le fichier `../tb_listepst.csv` et importer tous les pasteurs dans la base de données.

### 6. Tester l'API

#### Créer un compte utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "mot_de_passe": "test123",
    "nom": "Doe",
    "prenom": "John"
  }'
```

#### Se connecter

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "mot_de_passe": "test123"
  }'
```

Copier le `token` retourné.

#### Récupérer la liste des pasteurs

```bash
curl http://localhost:3000/api/pasteurs \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## 🔐 Compte admin par défaut

Un compte administrateur est créé automatiquement:

```
Email: admin@presence.mg
Mot de passe: admin123
```

**⚠️ IMPORTANT**: Changez ce mot de passe en production !

## 🚀 Démarrage

### Mode développement (avec auto-reload)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

## 📱 Configuration de l'application mobile

Dans le fichier `lib/api.ts` de l'application React Native, modifier l'URL de l'API:

```typescript
// Pour le développement local
const API_URL = 'http://localhost:3000/api';

// Pour le développement avec un appareil physique
// Remplacer par l'IP de votre ordinateur
const API_URL = 'http://192.168.1.XXX:3000/api';

// Pour la production
const API_URL = 'https://votre-domaine.com/api';
```

## 🐛 Dépannage

### Erreur de connexion MySQL

```
❌ Erreur de connexion MySQL: Access denied
```

**Solution**: Vérifier les identifiants MySQL dans `.env`

### Erreur "Table doesn't exist"

```
❌ Table 'pasteurs' doesn't exist
```

**Solution**: Exécuter le fichier SQL:
```bash
mysql -u root -p presence_pasteurs < database/schema.sql
```

### Port déjà utilisé

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: 
- Changer le port dans `.env` (ex: `PORT=3001`)
- Ou tuer le processus qui utilise le port 3000

## 📊 Structure de la base de données

- **utilisateurs**: Comptes utilisateurs (admin, organisateur, verificateur)
- **pasteurs**: Informations des pasteurs (30 colonnes)
- **evenements**: Événements/réunions
- **presences**: Enregistrements de présence avec QR code

## 🔄 Mise à jour

Pour mettre à jour les dépendances:

```bash
npm update
```

## 📝 Logs

Les logs sont affichés dans la console. Pour sauvegarder les logs:

```bash
npm start > logs.txt 2>&1
```

## ✅ Vérification de l'installation

Accéder à: http://localhost:3000

Vous devriez voir:

```json
{
  "success": true,
  "message": "API Présence Pasteurs - Backend",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "pasteurs": "/api/pasteurs",
    "evenements": "/api/evenements",
    "presences": "/api/presences"
  }
}
```

L'installation est terminée ! 🎉

