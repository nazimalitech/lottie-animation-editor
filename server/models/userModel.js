const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lottie_animation_editor',
  password: 'H7n8m6k1r',
  port: 5432,
});

const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  );
  return res.rows[0];
};

const getUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

module.exports = {
  registerUser,
  getUserByUsername,
};
