CREATE TABLE taranki_levy (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

