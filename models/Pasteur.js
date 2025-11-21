const { pool } = require('../config/database');

class Pasteur {
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO pasteurs (
        matricule, nom, prenom, nom_bapteme, date_naissance, lieu_naissance,
        fokontany, firaisana, fivondronana, pere, mere, cin, cin_obtenu_a, cin_date,
        ethnie, region_origine, conjoint_nom, conjoint_date_naissance, conjoint_lieu_naissance,
        conjoint_cin, conjoint_cin_obtenu_a, conjoint_cin_date, nombre_enfants,
        famille_proche_1, famille_proche_2, famille_proche_3, numero_bapteme,
        lieu_affectation, email, telephone, photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.matricule, data.nom, data.prenom, data.nom_bapteme, data.date_naissance, data.lieu_naissance,
        data.fokontany, data.firaisana, data.fivondronana, data.pere, data.mere, data.cin, data.cin_obtenu_a, data.cin_date,
        data.ethnie, data.region_origine, data.conjoint_nom, data.conjoint_date_naissance, data.conjoint_lieu_naissance,
        data.conjoint_cin, data.conjoint_cin_obtenu_a, data.conjoint_cin_date, data.nombre_enfants,
        data.famille_proche_1, data.famille_proche_2, data.famille_proche_3, data.numero_bapteme,
        data.lieu_affectation, data.email, data.telephone, data.photo_url
      ]
    );
    return result.insertId;
  }

  static async findAll(limit = 100, offset = 0) {
    const [rows] = await pool.query(
      'SELECT * FROM pasteurs ORDER BY nom, prenom LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM pasteurs WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByMatricule(matricule) {
    const [rows] = await pool.query('SELECT * FROM pasteurs WHERE matricule = ?', [matricule]);
    return rows[0];
  }

  static async search(searchTerm) {
    const [rows] = await pool.query(
      `SELECT * FROM pasteurs 
       WHERE matricule LIKE ? OR nom LIKE ? OR prenom LIKE ? OR lieu_affectation LIKE ?
       ORDER BY nom, prenom
       LIMIT 50`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    values.push(id);

    const [result] = await pool.query(
      `UPDATE pasteurs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM pasteurs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM pasteurs');
    return rows[0].total;
  }

  static async getByLieuAffectation(lieu) {
    const [rows] = await pool.query(
      'SELECT * FROM pasteurs WHERE lieu_affectation = ? ORDER BY nom, prenom',
      [lieu]
    );
    return rows;
  }
}

module.exports = Pasteur;

