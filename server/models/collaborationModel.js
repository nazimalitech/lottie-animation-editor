const pool = require('../server/db');

const getCollaborations = async (animation_id) => {
  const res = await pool.query('SELECT * FROM collaborations WHERE animation_id = $1', [animation_id]);
  return res.rows;
};

const addOrUpdateCollaboration = async (animation_id, user_id, state) => {
  const res = await pool.query(
    'INSERT INTO collaborations (animation_id, user_id, state) VALUES ($1, $2, $3) ON CONFLICT (animation_id, user_id) DO UPDATE SET state = EXCLUDED.state RETURNING *',
    [animation_id, user_id, state]
  );
  return res.rows[0];
};

const deleteCollaboration = async (animation_id, user_id) => {
  await pool.query('DELETE FROM collaborations WHERE animation_id = $1 AND user_id = $2', [animation_id, user_id]);
};

module.exports = {
  getCollaborations,
  addOrUpdateCollaboration,
  deleteCollaboration,
};
