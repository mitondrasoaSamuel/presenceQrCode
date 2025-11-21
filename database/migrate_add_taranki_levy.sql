-- Migration pour ajouter le support des Tarank'i Levy dans la table presences
USE presence_pasteurs;

-- Ajouter la colonne taranki_levy_id après pasteur_id
ALTER TABLE presences ADD COLUMN taranki_levy_id INT NULL AFTER pasteur_id;

-- Ajouter la colonne type_personne après matricule_scanne
ALTER TABLE presences ADD COLUMN type_personne ENUM('pasteur', 'taranki_levy') NOT NULL DEFAULT 'pasteur' AFTER matricule_scanne;

-- Ajouter les index
ALTER TABLE presences ADD INDEX idx_taranki_levy (taranki_levy_id);
ALTER TABLE presences ADD INDEX idx_type_personne (type_personne);

-- Ajouter la clé étrangère pour taranki_levy_id
ALTER TABLE presences ADD CONSTRAINT fk_presences_taranki_levy 
  FOREIGN KEY (taranki_levy_id) REFERENCES taranki_levy(id) ON DELETE CASCADE;

-- Mettre à jour les données existantes pour avoir le bon type_personne
UPDATE presences SET type_personne = 'pasteur' WHERE pasteur_id IS NOT NULL;

SELECT 'Migration terminée avec succès!' as message;

