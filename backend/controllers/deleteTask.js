const db = require('../helpers/database');
const tokenValid = require('../helpers/token');
const fse = require('fs-extra');
const Pushwoosh = require('../controllers/pushWooshAPI');

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    let token = req.headers.authtoken;
    let isValid = await tokenValid.verifyToken(token);
    if (isValid.connected) {
        let query = 'DELETE FROM task WHERE task_id = $1';
        let params = [taskId];
        let client = await db.getClient();
        let pwClient = Pushwoosh.getClient();
        try {
            let results = await client.query('SELECT message_code FROM current_tasks WHERE task_id = $1', [taskId]);
            if (results.rowCount > 0){
                pwClient.deleteMessage(results.rows[0].message_code, (err, res) => {});
            }
            await client.query(query, params);
            await fse.remove(`media/tasks/${isValid.id}/${taskId}`);
            res.status(200).json({ title: 'success', content: 'Task deleted.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ title: 'error', content: "Couldn't delete task." });
        } finally {
            client.release();
        }
    }
    else {
        res.status(403).json({ title: 'error', content: 'Invalid token.' });
    }
}

module.exports = {
    deleteTask
}