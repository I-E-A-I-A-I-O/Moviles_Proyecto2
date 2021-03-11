const db = require('../helpers/database');
const tokenValid = require('../helpers/token');

const getCurrentTasks = async (req, res) => {
    let token = req.headers.authtoken;
    let isValid = await tokenValid.verifyToken(token);
    if (isValid.connected){
        let client = await db.getClient();
        let query = 'SELECT ct.task_id, t.name, t.tag, tao.list_index, tao.current_task_id FROM current_tasks ct INNER JOIN task t ON ct.task_id = t.task_id INNER JOIN task_order tao ON tao.current_task_id = ct.current_task_id WHERE t.user_id = $1 ORDER BY tao.list_index';
        let params = [isValid.id];
        let notPinnedSelect = await client.query(query, params);
        query = 'SELECT ct.task_id, t.name, t.tag, ct.current_task_id FROM current_tasks ct INNER JOIN task t ON t.task_id = ct.task_id INNER JOIN pinned_tasks pit ON pit.current_task_id = ct.current_task_id WHERE t.user_id = $1';
        let pinnedSelect = await client.query(query, params);
        res.status(200).json({title: 'Success', content: {tasks: notPinnedSelect.rows, pinned: pinnedSelect.rows}});
    }
    else{
        res.status(403).json({title: 'Error', content: 'Access denied.'});
    }
}

module.exports = { getCurrentTasks };