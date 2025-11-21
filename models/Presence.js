const { pool } = require('../config/database');

class Presence {
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO presences (pasteur_id, taranki_levy_id, type_personne, evenement_id, matricule_scanne, date_presence, heure_arrivee, enregistre_par, methode_enregistrement)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.pasteur_id || null,
        data.taranki_levy_id || null,
        data.type_personne || 'pasteur',
        data.evenement_id,
        data.matricule_scanne,
        data.date_presence,
        data.heure_arrivee,
        data.enregistre_par,
        data.methode_enregistrement,
      ]
    );
    return { id: result.insertId, ...data };
  }

  static async checkIfPresent(
    pasteur_id,
    taranki_levy_id,
    evenement_id,
    type_personne
  ) {
    let query = 'SELECT * FROM presences WHERE evenement_id = ? AND ';
    let params = [evenement_id];

    if (type_personne === 'taranki_levy' && taranki_levy_id) {
      query += 'taranki_levy_id = ? AND type_personne = ?';
      params.push(taranki_levy_id, 'taranki_levy');
    } else if (pasteur_id) {
      query += 'pasteur_id = ? AND type_personne = ?';
      params.push(pasteur_id, 'pasteur');
    } else {
      return null;
    }

    const [rows] = await pool.query(query, params);
    return rows[0];
  }

  static async getByEvent(evenement_id) {
    const [rows] = await pool.query(
      `SELECT p.*, 
              pa.matricule, pa.nom, pa.prenom, pa.nom_bapteme, pa.date_naissance, pa.lieu_naissance, 
              pa.fokontany, pa.firaisana, pa.fivondronana, pa.pere, pa.mere, pa.cin, pa.cin_obtenu_a, 
              pa.cin_date, pa.ethnie, pa.region_origine, pa.conjoint_nom, pa.conjoint_date_naissance, 
              pa.conjoint_lieu_naissance, pa.conjoint_cin, pa.conjoint_cin_obtenu_a, pa.conjoint_cin_date, 
              pa.nombre_enfants, pa.famille_proche_1, pa.famille_proche_2, pa.famille_proche_3, 
              pa.numero_bapteme, pa.lieu_affectation, pa.email, pa.telephone, pa.photo_url,
              tl.matricule_tl, tl.nom as tl_nom, tl.prenom as tl_prenom, tl.genre as tl_genre, 
              tl.date_naissance as tl_date_naissance, tl.cin_tl as tl_cin_tl, tl.num_tel as tl_num_tel,
              tl.matricule_pst, 
              pa_ref.lieu_affectation as pasteur_lieu,
              u.nom as enregistre_par_nom, u.prenom as enregistre_par_prenom
       FROM presences p
       LEFT JOIN pasteurs pa ON p.pasteur_id = pa.id
       LEFT JOIN taranki_levy tl ON p.taranki_levy_id = tl.id
       LEFT JOIN pasteurs pa_ref ON tl.pasteur_id = pa_ref.id
       LEFT JOIN utilisateurs u ON p.enregistre_par = u.id
       WHERE p.evenement_id = ?
       ORDER BY p.heure_arrivee ASC`,
      [evenement_id]
    );
    return rows;
  }

  static async getByPasteur(pasteur_id) {
    const [rows] = await pool.query(
      `SELECT p.*, e.titre as evenement_titre, e.date_evenement, e.lieu as evenement_lieu
       FROM presences p
       INNER JOIN evenements e ON p.evenement_id = e.id
       WHERE p.pasteur_id = ?
       ORDER BY e.date_evenement DESC`,
      [pasteur_id]
    );
    return rows;
  }

  static async getStats(evenement_id) {
    const [presentsRows] = await pool.query(
      'SELECT COUNT(*) as total_presents FROM presences WHERE evenement_id = ?',
      [evenement_id]
    );

    const [totalRows] = await pool.query(
      'SELECT COUNT(*) as total_pasteurs FROM pasteurs'
    );

    const [methodRows] = await pool.query(
      `SELECT methode_enregistrement, COUNT(*) as count 
       FROM presences 
       WHERE evenement_id = ? 
       GROUP BY methode_enregistrement`,
      [evenement_id]
    );

    const total_presents = presentsRows[0].total_presents;
    const total_pasteurs = totalRows[0].total_pasteurs;
    const taux_presence =
      total_pasteurs > 0
        ? ((total_presents / total_pasteurs) * 100).toFixed(2)
        : 0;

    return {
      total_presents,
      total_pasteurs,
      taux_presence: parseFloat(taux_presence),
      par_methode: methodRows,
    };
  }

  static async getAbsents(evenement_id) {
    const [rows] = await pool.query(
      `SELECT pa.* FROM pasteurs pa
       WHERE pa.id NOT IN (
         SELECT p.pasteur_id FROM presences p WHERE p.evenement_id = ?
       )
       ORDER BY pa.nom, pa.prenom`,
      [evenement_id]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT p.*, 
              pa.matricule, pa.nom, pa.prenom, pa.photo_url, pa.lieu_affectation,
              tl.matricule_tl, tl.nom as tl_nom, tl.prenom as tl_prenom,
              tl.matricule_pst,
              pa_ref.lieu_affectation as pasteur_lieu,
              e.titre as evenement_titre, e.date_evenement
       FROM presences p
       LEFT JOIN pasteurs pa ON p.pasteur_id = pa.id
       LEFT JOIN taranki_levy tl ON p.taranki_levy_id = tl.id
       LEFT JOIN pasteurs pa_ref ON tl.pasteur_id = pa_ref.id
       INNER JOIN evenements e ON p.evenement_id = e.id
       ORDER BY p.date_presence DESC, p.heure_arrivee DESC`
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM presences WHERE id = ?', [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = Presence;
