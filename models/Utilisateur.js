const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Utilisateur {
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.mot_de_passe, 10);
    const [result] = await pool.query(
      'INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom, role) VALUES (?, ?, ?, ?, ?)',
      [data.email, hashedPassword, data.nom, data.prenom, data.role || 'verificateur']
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = ? AND actif = TRUE',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, email, nom, prenom, role, actif, created_at FROM utilisateurs WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await pool.query(
      'SELECT id, email, nom, prenom, role, actif, created_at FROM utilisateurs ORDER BY created_at DESC'
    );
    return rows;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.nom) {
      fields.push('nom = ?');
      values.push(data.nom);
    }
    if (data.prenom) {
      fields.push('prenom = ?');
      values.push(data.prenom);
    }
    if (data.role) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (data.mot_de_passe) {
      fields.push('mot_de_passe = ?');
      values.push(await bcrypt.hash(data.mot_de_passe, 10));
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE utilisateurs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('UPDATE utilisateurs SET actif = FALSE WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Utilisateur;

