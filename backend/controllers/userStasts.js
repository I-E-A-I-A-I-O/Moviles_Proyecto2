const tokenVerifier = require('../helpers/token');
const database = require('../helpers/database');

userStats = async (req, res) => {
    let token = req.headers.authtoken;
    let verified = await tokenVerifier.verifyToken(token);
    if (verified.connected){
      let client = await database.getClient();
      let stats = { tasks_create: null, completed_tasks: null, pinned_tasks: null };
      let query = "SELECT t.complete_date, COUNT(t.task_id) FROM task AS t WHERE user_id = $1";
      try{
        let results = await client.query(query, [verified.id]);
        stats.tasks_create = results.rows[0];
        query = 'SELECT t.complete_date,COUNT(ct.completed_task_id) AS completed_tasks_count FROM completed_tasks ct INNER JOIN task t ON t.task_id = ct.task_id WHERE t.user_id = $1 GROUP BY t.complete_date';
        results = await client.query(query, [verified.id]);
        stats.completed_tasks = results.rows[0];
        query= 'SELECT COUNT(pt.pinned_task_id) AS pinned_tasks_count FROM pinned_tasks pt INNER JOIN task_order ta ON pt.current_task_id = ta.current_task_id WHERE pt.user_id = $1';
        results = await client.query(query, [verified.id]);
        stats.pinned_tasks = results.rows[0];
        res.status(200).json({ title: "Success", content: stats });
      }catch(e){
        console.log(e);
        res.status(500).json({ title: "Error", content: "Error retrieving stats..." });
      }finally{
        client.release();
      }
    }
    else{
      res.status(403).json({ title: "Error", content: "stasts first" });
    }
  }

  module.exports = {userStats};