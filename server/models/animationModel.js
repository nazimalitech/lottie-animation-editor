const pool = require('../server/db');

const getAnimations = async () => {
  const res = await pool.query('SELECT * FROM animations');
  return res.rows;
};

const getAnimationById = async (id) => {
  const res = await pool.query('SELECT * FROM animations WHERE id = $1', [id]);
  return res.rows[0];
};

const addAnimation = async (name, data) => {
  const res = await pool.query(
    'INSERT INTO animations (name, data) VALUES ($1, $2) RETURNING *',
    [name, data]
  );
  return res.rows[0];
};

const updateAnimation = async (id, name, data) => {
  const res = await pool.query(
    'UPDATE animations SET name = $1, data = $2 WHERE id = $3 RETURNING *',
    [name, data, id]
  );
  return res.rows[0];
};

const deleteAnimation = async (id) => {
  await pool.query('DELETE FROM animations WHERE id = $1', [id]);
};

module.exports = {
  getAnimations,
  getAnimationById,
  addAnimation,
  updateAnimation,
  deleteAnimation,
};
