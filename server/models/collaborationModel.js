const { Pool } = require('pg');

// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lottie_animation_editor',
  password: 'H7n8m6k1r',
  port: 5432,
});

const getCollaborations = async (animation_id) => {
  const res = await pool.query('SELECT * FROM user_collaborations WHERE animation_id = $1', [animation_id]);
  return res.rows;
};

const addOrUpdateCollaboration = async (animation_id, user_id, state) => {
  const res = await pool.query(
    `INSERT INTO user_collaborations (animation_id, user_id, state)
     VALUES ($1, $2, $3)
     ON CONFLICT (animation_id, user_id)
     DO UPDATE SET state = $3, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [animation_id, user_id, state]
  );
  return res.rows[0];
};

const deleteCollaboration = async (animation_id, user_id) => {
  await pool.query('DELETE FROM user_collaborations WHERE animation_id = $1 AND user_id = $2', [animation_id, user_id]);
  return { message: 'Collaboration deleted successfully' };
};

module.exports = {
  getCollaborations,
  addOrUpdateCollaboration,
  deleteCollaboration,
};
