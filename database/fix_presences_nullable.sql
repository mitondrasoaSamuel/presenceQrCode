-- Correction : permettre NULL pour pasteur_id et taranki_levy_id
USE presence_pasteurs;

-- Modifier la colonne pasteur_id pour accepter NULL
ALTER TABLE presences MODIFY COLUMN pasteur_id INT NULL;

-- Modifier la colonne taranki_levy_id pour accepter NULL (si ce n'est pas déjà fait)
ALTER TABLE presences MODIFY COLUMN taranki_levy_id INT NULL;

SELECT 'Colonnes modifiées avec succès! pasteur_id et taranki_levy_id peuvent maintenant être NULL.' as message;

