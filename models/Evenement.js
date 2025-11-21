const { pool } = require('../config/database');

class Evenement {
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO evenements (titre, description, lieu, date_evenement, statut, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.titre, data.description, data.lieu, data.date_evenement, data.statut || 'planifie', data.created_by]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT e.*, u.nom as createur_nom, u.prenom as createur_prenom
       FROM evenements e
       LEFT JOIN utilisateurs u ON e.created_by = u.id
       ORDER BY e.date_evenement DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT e.*, u.nom as createur_nom, u.prenom as createur_prenom
       FROM evenements e
       LEFT JOIN utilisateurs u ON e.created_by = u.id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findDisponibles() {
    const [rows] = await pool.query(
      `SELECT * FROM evenements 
       WHERE statut IN ('planifie', 'en_cours')
       ORDER BY date_evenement DESC`
    );
    return rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.titre) {
      fields.push('titre = ?');
      values.push(data.titre);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.lieu !== undefined) {
      fields.push('lieu = ?');
      values.push(data.lieu);
    }
    if (data.date_evenement) {
      fields.push('date_evenement = ?');
      values.push(data.date_evenement);
    }
    if (data.statut) {
      fields.push('statut = ?');
      values.push(data.statut);
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE evenements SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async updateStatut(id, statut) {
    const [result] = await pool.query(
      'UPDATE evenements SET statut = ? WHERE id = ?',
      [statut, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM evenements WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM evenements');
    return rows[0].total;
  }
}

module.exports = Evenement;

