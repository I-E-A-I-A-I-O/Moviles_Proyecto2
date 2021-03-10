const db = require('../helpers/database');

const completeTask = async (req, res) => {
    let taskId = req.params.taskId;
    let client = await db.getClient();
    let query = 'DELETE FROM current_tasks WHERE task_id = $1';
    let params = [taskId];
    try {
        await client.query(query, params);
        query = 'INSERT INTO completed_tasks(task_id) VALUES($1)';
        await client.query(query, params);
        res.status(200).json({ title: 'Success', content: '' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ title: 'Error', content: '' });
    } finally {
        client.release();
    }
}

module.exports = { completeTask };