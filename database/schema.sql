-- Création de la base de données
CREATE DATABASE IF NOT EXISTS presence_pasteurs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE presence_pasteurs;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  role ENUM('admin', 'organisateur', 'verificateur') DEFAULT 'verificateur',
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Table des pasteurs
CREATE TABLE IF NOT EXISTS pasteurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricule VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  nom_bapteme VARCHAR(100),
  date_naissance DATE,
  lieu_naissance VARCHAR(100),
  fokontany VARCHAR(100),
  firaisana VARCHAR(100),
  fivondronana VARCHAR(100),
  pere VARCHAR(100),
  mere VARCHAR(100),
  cin VARCHAR(20) UNIQUE,
  cin_obtenu_a VARCHAR(100),
  cin_date DATE,
  ethnie VARCHAR(50),
  region_origine VARCHAR(100),
  conjoint_nom VARCHAR(100),
  conjoint_date_naissance DATE,
  conjoint_lieu_naissance VARCHAR(100),
  conjoint_cin VARCHAR(20),
  conjoint_cin_obtenu_a VARCHAR(100),
  conjoint_cin_date DATE,
  nombre_enfants INT DEFAULT 0,
  famille_proche_1 TEXT,
  famille_proche_2 TEXT,
  famille_proche_3 TEXT,
  numero_bapteme INT,
  lieu_affectation VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  telephone VARCHAR(20),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_matricule (matricule),
  INDEX idx_nom (nom),
  INDEX idx_lieu_affectation (lieu_affectation)
) ENGINE=InnoDB;

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  lieu VARCHAR(200),
  date_evenement DATETIME NOT NULL,
  statut ENUM('planifie', 'en_cours', 'termine', 'annule') DEFAULT 'planifie',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date_evenement (date_evenement),
  INDEX idx_statut (statut),
  FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table des Tarank'i Levy (Diacres/Assistants)
CREATE TABLE IF NOT EXISTS taranki_levy (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricule_tl VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  genre ENUM('LEHILAHY', 'VEHIVAVY', 'NON_SPECIFIE') DEFAULT 'NON_SPECIFIE',
  date_naissance DATE,
  cin_tl VARCHAR(20),
  num_tel VARCHAR(20),
  matricule_pst VARCHAR(50),
  pasteur_id INT,
  date_registre DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_matricule_tl (matricule_tl),
  INDEX idx_matricule_pst (matricule_pst),
  INDEX idx_pasteur_id (pasteur_id),
  FOREIGN KEY (pasteur_id) REFERENCES pasteurs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Table des présences (modifiée pour supporter TL)
CREATE TABLE IF NOT EXISTS presences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pasteur_id INT,
  taranki_levy_id INT,
  evenement_id INT NOT NULL,
  matricule_scanne VARCHAR(50) NOT NULL,
  type_personne ENUM('pasteur', 'taranki_levy') NOT NULL DEFAULT 'pasteur',
  date_presence DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  heure_arrivee TIME NOT NULL,
  enregistre_par INT,
  methode_enregistrement ENUM('qr_scan', 'manuel') DEFAULT 'qr_scan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pasteur_id) REFERENCES pasteurs(id) ON DELETE CASCADE,
  FOREIGN KEY (taranki_levy_id) REFERENCES taranki_levy(id) ON DELETE CASCADE,
  FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE,
  FOREIGN KEY (enregistre_par) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  INDEX idx_pasteur (pasteur_id),
  INDEX idx_taranki_levy (taranki_levy_id),
  INDEX idx_evenement (evenement_id),
  INDEX idx_matricule_scanne (matricule_scanne),
  INDEX idx_type_personne (type_personne)
) ENGINE=InnoDB;

-- Créer un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom, role, actif)
VALUES ('admin@presence.mg', '$2a$10$7KZs8qWXJ0xJ1YZH2QZ8Ku8YvxFQXJ7XxGJZ1Z8Z1Z8Z1Z8Z1Z8Z1O', 'Admin', 'System', 'admin', TRUE)
ON DUPLICATE KEY UPDATE email=email;

