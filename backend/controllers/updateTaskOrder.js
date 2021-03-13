const db = require('../helpers/database');
const jwt = require('../helpers/token');

const updateOrder = async (req, res) => {
    let token = req.headers.authtoken;
    let tokenValid = await jwt.verifyToken(token);
    if (tokenValid.connected) {
        let client = await db.getClient();
        try {
            await client.query('BEGIN', []);
            let normal = await insert(client, req.body.tasks, tokenValid.id, 'normal');
            let pinned = await insert(client, req.body.pinned, tokenValid.id, 'pinned');
            if (normal && pinned) {
                client.query('COMMIT', []);
                res.status(200).json({ title: 'Success', content: 'Task order updated.' });
            }
            else {
                client.query('ROLLBACK', []);
                res.status(500).json({ title: 'Error', content: "Couldn't save new order." });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ title: 'Error', content: "Couldn't save new order." });
        } finally {
            client.release();
        }
    }
    else {
        res.status(403).json({ title: 'Error', content: "Can't do that" });
    }
}

const insert = async (client, tasks, userId, type) => {
    try {
        let query = type === 'normal' ? 'DELETE FROM task_order WHERE user_id = $1'
            : 'DELETE FROM pinned_tasks WHERE user_id = $1';
        let params = [userId];
        await client.query(query, params);
        if (tasks.length > 0) {
            let values = generateValues(tasks.length, type === 'normal' ? 3 : 2);
            params = generateParams(tasks, userId, type);
            query = type === 'normal' ?
                `INSERT INTO task_order(current_task_id, list_index, user_id) VALUES${values}`
                : `INSERT INTO pinned_tasks(current_task_id, user_id) VALUES${values}`;
            await client.query(query, params);
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const generateValues = (rows, optionsPerRow) => {
    let values = '';
    let count = 0;
    for (let i = 0; i < rows; i++) {
        for (let n = 0; n < optionsPerRow; n++) {
            if (n === 0) {
                values += `($${++count}, `;
            }
            else if (n === (optionsPerRow - 1)) {
                values += `$${++count})`;
            }
            else {
                values += `$${++count}, `;
            }

        }
        if (i < (rows - 1)) {
            values += ', ';
        }
    }
    return values;
}

const generateParams = (data, userId, type) => {
    let params = [];
    for (let i = 0; i < data.length; i++) {
        if (type === 'normal') {
            params.push(data[i].current_task_id, data[i].list_index, userId);
        }
        else {
            params.push(data[i].current_task_id, userId);
        }
    }
    return params;
}

module.exports = { updateOrder };