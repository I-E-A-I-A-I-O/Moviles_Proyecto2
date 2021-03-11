const db = require('../helpers/database');
const jwt = require('../helpers/token');
const mp = require('multiparty');
const fse = require('fs-extra');
const { getClient } = require('./pushWooshAPI');

const saveTask = async (req, res) => {
    let token = req.headers.authtoken;
    let pushToken = req.headers.pushtoken;
    let tokenValid = await jwt.verifyToken(token);
    if (tokenValid.connected) {
        let form = new mp.Form();
        form.parse(req, (error, fields, files) => {
            if (error) {
                res.status(400).json({ title: 'Error', content: 'Error parsing form data' });
            }
            else {
                let { name, description, tag, date, time } = fields;
                let fieldsGood = verifyFields(name[0], description[0], tag[0]);
                let data = {
                    name: name[0],
                    description: description[0],
                    tag: tag[0],
                    date: date[0],
                    time: time[0]
                }
                if (fieldsGood === 'OK.') {
                    saveTaskData(tokenValid.id, pushToken, data, files, res);
                }
                else {
                    res.status(400).json({ title: 'Error', content: fieldsGood })
                }
            }
        });
    }
    else {
        res.status(403).json({ title: 'Error', content: 'Access denied.' });
    }
}

const saveTaskData = async (userId, pushToken, data, files, res) => {
    if (files.image) {
        insertTaskData(userId, pushToken, data, files.image[0], res);
    }
    else {
        await insertTaskData(userId, pushToken, data, null, res);
    }
}

const saveImage = async (image, userId, task_id, client, res) => {
    try {
        let query = 'UPDATE task SET image = $1 WHERE task_id = $2';
        let path = `media/tasks/${userId}/${task_id}`;
        let absolutePath = `${path}/${image.originalFilename}`;
        await fse.ensureDir(path);
        await fse.copy(image.path, absolutePath);
        await fse.unlink(image.path);
        let params = [absolutePath, task_id];
        await client.query(query, params);
        client.query('COMMIT', []);
        res.status(200).json({ title: 'Success', content: 'Task saved.' });
    } catch (err) {
        console.log(err);
        client.query('ROLLBACK');
        res.status(500).json({ title: 'Error', content: 'Error saving the task.' });
    }
}

const insertTaskData = async (userId, pushToken, data, file = null, res) => {
    let client = await db.getClient();
    try {
        await client.query('BEGIN', []);
        let query = 'INSERT INTO task(user_id, name, description, complete_date, tag) VALUES($1, $2, $3, $4, $5) RETURNING task_id';
        let complete_date = `${data.date}T${data.time}`;
        let params = [userId, data.name, data.description, complete_date, data.tag];
        let result = await client.query(query, params);
        getClient().sendMessage(data.name, [pushToken], { send_date: `${data.date} ${data.time}`, timezone: 'America/Caracas', data: { task_id: result.rows[0].task_id } }, (error, response) => {
            if (!error) {
                insertOrder(client, result.rows[0].task_id, response.Messages[0], userId)
                    .then(completed => {
                        if (completed && file) {
                            saveImage(file, userId, result.rows[0].task_id, client, res);
                        }
                        else if (completed && !file) {
                            client.query('COMMIT', []);
                            res.status(200).json({ title: 'Success', content: 'Task saved.' })
                        }
                        else {
                            client.query('ROLLBACK', []);
                            res.status(500).json({ title: 'Error', content: 'Error saving the task' });
                        }
                    })
            }
            else {
                client.query('ROLLBACK', []);
                res.status(500).json({ title: 'Error', content: 'Error saving the task' });
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        client.query('ROLLBACK', []);
        return false;
    } finally {
        client.release();
    }
}

const insertOrder = async (client, task_id, message_code, userId) => {
    try {
        let query = 'INSERT INTO current_tasks(task_id, message_code) VALUES($1, $2) RETURNING current_task_id';
        let params = [task_id, message_code];
        let saveResult = await client.query(query, params);
        query = 'SELECT list_index FROM task_order WHERE user_id = $1 ORDER BY list_index desc';
        let countResult = await client.query(query, [userId]);
        let index = countResult.rowCount > 0 ? countResult.rows[0].list_index + 1 : 0;
        query = 'INSERT INTO task_order(current_task_id, list_index, user_id) VALUES($1, $2, $3)';
        params = [saveResult.rows[0].current_task_id, index, userId];
        await client.query(query, params);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const verifyFields = (name, description, tag) => {
    if (name.length < 1) {
        return 'Name field cannot be empty.';
    }
    else if (name.length < 2 || name.length > 25) {
        return 'Name must be between 2 and 25 characters.';
    }
    else if (description.length > 140) {
        return 'Description cannot be longer than 140 characters.';
    }
    else if (tag > 10) {
        return 'Tag cannot be longer than 10 characters.';
    }
    else {
        return 'OK.';
    }
}

module.exports = { saveTask };