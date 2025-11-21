const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
const Pasteur = require('../models/Pasteur');

async function importTarankiLevy() {
  try {
    console.log('📥 Démarrage de l\'import des Tarank\'i Levy...\n');

    const csvPath = path.join(__dirname, '../../tb_listetl.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Fichier tb_listetl.csv non trouvé !');
      console.log('📍 Recherché dans:', csvPath);
      return;
    }

    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvData.split('\n');
    
    console.log(`📊 ${lines.length - 1} lignes trouvées dans le CSV\n`);

    let imported = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(';');

      if (columns.length < 10) {
        console.log(`⚠️  Ligne ${i} ignorée (colonnes insuffisantes)`);
        continue;
      }

      const matricule_tl = columns[1]?.trim();
      const nom = columns[2]?.trim();
      const prenom = columns[3]?.trim();
      const genre_raw = columns[4]?.trim();
      const date_naissance_raw = columns[5]?.trim();
      const cin_tl = columns[6]?.trim();
      const num_tel = columns[7]?.trim();
      const matricule_pst = columns[8]?.trim();
      const date_registre_raw = columns[9]?.trim();

      if (!matricule_tl || !nom || !prenom) {
        console.log(`⚠️  Ligne ${i} ignorée (données manquantes)`);
        continue;
      }

      let genre = 'NON_SPECIFIE';
      if (genre_raw === 'LEHILAHY') genre = 'LEHILAHY';
      else if (genre_raw === 'VEHIVAVY') genre = 'VEHIVAVY';

      let date_naissance = null;
      if (date_naissance_raw && date_naissance_raw !== '----') {
        const parts = date_naissance_raw.split('/');
        if (parts.length === 3) {
          date_naissance = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      let date_registre = null;
      if (date_registre_raw && date_registre_raw !== '----') {
        const dateObj = new Date(date_registre_raw);
        if (!isNaN(dateObj.getTime())) {
          date_registre = dateObj;
        }
      }

      let pasteur_id = null;
      if (matricule_pst && matricule_pst !== '----') {
        try {
          const pasteur = await Pasteur.findByMatricule(matricule_pst);
          if (pasteur) {
            pasteur_id = pasteur.id;
          }
        } catch (err) {
          console.log(`⚠️  Pasteur ${matricule_pst} non trouvé pour ${nom} ${prenom}`);
        }
      }

      try {
        await pool.query(
          `INSERT INTO taranki_levy (matricule_tl, nom, prenom, genre, date_naissance, cin_tl, num_tel, matricule_pst, pasteur_id, date_registre)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           nom = VALUES(nom),
           prenom = VALUES(prenom),
           genre = VALUES(genre),
           date_naissance = VALUES(date_naissance),
           cin_tl = VALUES(cin_tl),
           num_tel = VALUES(num_tel),
           matricule_pst = VALUES(matricule_pst),
           pasteur_id = VALUES(pasteur_id),
           date_registre = VALUES(date_registre)`,
          [
            matricule_tl,
            nom,
            prenom,
            genre,
            date_naissance,
            cin_tl || null,
            num_tel || null,
            matricule_pst || null,
            pasteur_id,
            date_registre || new Date(),
          ]
        );

        imported++;
        console.log(`✅ ${imported}. ${nom} ${prenom} (${matricule_tl})`);
      } catch (error) {
        errors++;
        console.error(`❌ Erreur ligne ${i} (${matricule_tl}):`, error.message);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Import terminé !`);
    console.log(`📊 ${imported} Tarank'i Levy importés`);
    console.log(`❌ ${errors} erreurs`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  }
}

importTarankiLevy();

