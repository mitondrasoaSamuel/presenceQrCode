require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const createAdmin = async () => {
  try {
    const email = 'admin@presence.mg';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('DELETE FROM utilisateurs WHERE email = ?', [email]);

    const [result] = await pool.query(
      'INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom, role, actif) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, 'Admin', 'System', 'admin', true]
    );

    console.log('✅ Compte admin créé avec succès !');
    console.log('📧 Email: admin@presence.mg');
    console.log('🔑 Mot de passe: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

createAdmin();
