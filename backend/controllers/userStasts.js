const tokenVerifier = require('../helpers/token');
const database = require('../helpers/database');

const userStats = async (req, res) => {
  let token = req.headers.authtoken;
  let verified = await tokenVerifier.verifyToken(token);
  if (verified.connected) {
    let client = await database.getClient();
    let stats = { created_tasks: 0, completed_tasks: 0, pinned_tasks: 0, current_tasks: 0 };
    let query = "SELECT COUNT(task_id) FROM task WHERE user_id = $1";
    try {
      let results = await client.query(query, [verified.id]);
      stats.created_tasks = results.rows[0].count;
      query = 'SELECT COUNT(t.task_id) FROM current_tasks ct INNER JOIN task t ON t.task_id = ct.task_id WHERE t.user_id = $1';
      results = await client.query(query, [verified.id]);
      stats.current_tasks = results.rows[0].count;
      query = 'SELECT COUNT(t.task_id) FROM current_tasks ct INNER JOIN task t ON t.task_id = ct.task_id INNER JOIN pinned_tasks pt ON pt.current_task_id = ct.current_task_id WHERE t.user_id = $1';
      results = await client.query(query, [verified.id]);
      stats.pinned_tasks = results.rows[0].count;
      query = 'SELECT COUNT(t.task_id) FROM task t INNER JOIN completed_tasks ct ON ct.task_id = t.task_id WHERE t.user_id = $1';
      results = await client.query(query, [verified.id]);
      stats.completed_tasks = results.rows[0].count;
      res.status(200).json({ title: "success", content: stats });
    } catch (e) {
      console.error(e);
      res.status(500).json({ title: "error", content: "Error retrieving stats." });
    } finally {
      client.release();
    }
  }
  else {
    res.status(403).json({ title: "error", content: "Invalid token." });
  }
}

module.exports = { userStats };