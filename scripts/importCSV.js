require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { pool } = require('../config/database');

const parseDate = (dateStr) => {
  if (!dateStr || dateStr === '') return null;
  
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    if (year && month && day) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  if (dateStr.includes('-')) {
    return dateStr.split(' ')[0];
  }
  
  return null;
};

const importCSV = async () => {
  const csvFilePath = '../tb_listepst.csv';
  const results = [];

  console.log('📖 Lecture du fichier CSV...');

  fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`✅ ${results.length} lignes lues\n`);

      let imported = 0;
      let errors = 0;

      for (const row of results) {
        try {
          if (!row.matricule_pst || row.matricule_pst === '') continue;

          const pasteurData = {
            matricule: row.matricule_pst,
            nom: row.anarana || '',
            prenom: row.fanampiny || '',
            nom_bapteme: row.anarambositra || null,
            date_naissance: parseDate(row.teraka_ny),
            lieu_naissance: row.tao || null,
            fokontany: row.fkt || null,
            firaisana: row.fir || null,
            fivondronana: row.fiv || null,
            pere: row.zanak_i || null,
            mere: row.sy || null,
            cin: row.cin_pst || null,
            cin_obtenu_a: row.nalaina_tao || null,
            cin_date: parseDate(row.taminy),
            ethnie: row.foko || null,
            region_origine: row.tanindrazana || null,
            conjoint_nom: row.anarana_v || null,
            conjoint_date_naissance: parseDate(row.teraka_ny_v),
            conjoint_lieu_naissance: row.tao_v || null,
            conjoint_cin: row.cin_v || null,
            conjoint_cin_obtenu_a: row.nalaina_tao_v || null,
            conjoint_cin_date: parseDate(row.taminy_v),
            nombre_enfants: row.isan_janaka ? parseInt(row.isan_janaka) : 0,
            famille_proche_1: row.fianakaviana_akaiky1 || null,
            famille_proche_2: row.fianakaviana_akaiky2 || null,
            famille_proche_3: row.fianakaviana_akaiky3 || null,
            numero_bapteme: row.batisa_faha ? parseInt(row.batisa_faha) : null,
            lieu_affectation: row.fiaram || null,
            email: null,
            telephone: null,
            photo_url: null
          };

          await pool.query(
            `INSERT INTO pasteurs (
              matricule, nom, prenom, nom_bapteme, date_naissance, lieu_naissance,
              fokontany, firaisana, fivondronana, pere, mere, cin, cin_obtenu_a, cin_date,
              ethnie, region_origine, conjoint_nom, conjoint_date_naissance, conjoint_lieu_naissance,
              conjoint_cin, conjoint_cin_obtenu_a, conjoint_cin_date, nombre_enfants,
              famille_proche_1, famille_proche_2, famille_proche_3, numero_bapteme,
              lieu_affectation, email, telephone, photo_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(pasteurData)
          );

          imported++;
          console.log(`✅ Importé: ${pasteurData.nom} ${pasteurData.prenom} (${pasteurData.matricule})`);
        } catch (error) {
          errors++;
          console.error(`❌ Erreur pour ${row.matricule_pst}:`, error.message);
        }
      }

      console.log(`\n📊 Résumé:`);
      console.log(`   - Importés: ${imported}`);
      console.log(`   - Erreurs: ${errors}`);
      console.log(`   - Total: ${results.length}\n`);

      process.exit(0);
    });
};

importCSV().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

