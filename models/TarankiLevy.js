const { pool } = require('../config/database');

class TarankiLevy {
  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO taranki_levy (matricule_tl, nom, prenom, genre, date_naissance, cin_tl, num_tel, matricule_pst, pasteur_id, date_registre)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.matricule_tl,
        data.nom,
        data.prenom,
        data.genre || 'NON_SPECIFIE',
        data.date_naissance || null,
        data.cin_tl || null,
        data.num_tel || null,
        data.matricule_pst || null,
        data.pasteur_id || null,
        data.date_registre || new Date(),
      ]
    );
    return result.insertId;
  }

  static async findAll(limit = 100, offset = 0, search = '') {
    let query = `
      SELECT tl.*, 
             p.nom as pasteur_nom, p.prenom as pasteur_prenom, p.lieu_affectation as pasteur_lieu
      FROM taranki_levy tl
      LEFT JOIN pasteurs p ON tl.pasteur_id = p.id
    `;

    const params = [];

    if (search) {
      query += ` WHERE tl.nom LIKE ? OR tl.prenom LIKE ? OR tl.matricule_tl LIKE ? OR tl.num_tel LIKE ?`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    query += ` ORDER BY tl.matricule_tl ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT tl.*, 
              p.nom as pasteur_nom, p.prenom as pasteur_prenom, p.matricule as pasteur_matricule, p.lieu_affectation as pasteur_lieu
       FROM taranki_levy tl
       LEFT JOIN pasteurs p ON tl.pasteur_id = p.id
       WHERE tl.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByMatricule(matricule_tl) {
    const [rows] = await pool.query(
      `SELECT tl.*, 
              p.nom as pasteur_nom, p.prenom as pasteur_prenom, p.matricule as pasteur_matricule
       FROM taranki_levy tl
       LEFT JOIN pasteurs p ON tl.pasteur_id = p.id
       WHERE tl.matricule_tl = ?`,
      [matricule_tl]
    );
    return rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.matricule_tl !== undefined) {
      fields.push('matricule_tl = ?');
      values.push(data.matricule_tl);
    }
    if (data.nom !== undefined) {
      fields.push('nom = ?');
      values.push(data.nom);
    }
    if (data.prenom !== undefined) {
      fields.push('prenom = ?');
      values.push(data.prenom);
    }
    if (data.genre !== undefined) {
      fields.push('genre = ?');
      values.push(data.genre);
    }
    if (data.date_naissance !== undefined) {
      fields.push('date_naissance = ?');
      values.push(data.date_naissance || null);
    }
    if (data.cin_tl !== undefined) {
      fields.push('cin_tl = ?');
      values.push(data.cin_tl || null);
    }
    if (data.num_tel !== undefined) {
      fields.push('num_tel = ?');
      values.push(data.num_tel || null);
    }
    if (data.matricule_pst !== undefined) {
      fields.push('matricule_pst = ?');
      values.push(data.matricule_pst || null);
    }
    if (data.pasteur_id !== undefined) {
      fields.push('pasteur_id = ?');
      values.push(data.pasteur_id || null);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE taranki_levy SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM taranki_levy WHERE id = ?', [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async count(search = '') {
    let query = 'SELECT COUNT(*) as total FROM taranki_levy';
    const params = [];

    if (search) {
      query += ' WHERE nom LIKE ? OR prenom LIKE ? OR matricule_tl LIKE ?';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  }

  static async findByPasteurId(pasteur_id) {
    const [rows] = await pool.query(
      'SELECT * FROM taranki_levy WHERE pasteur_id = ? ORDER BY matricule_tl ASC',
      [pasteur_id]
    );
    return rows;
  }
}

module.exports = TarankiLevy;
