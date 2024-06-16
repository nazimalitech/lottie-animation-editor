const pool = require('../server/db');
const bcrypt = require('bcryptjs');

const registerUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
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
