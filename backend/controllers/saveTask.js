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
                if (fieldsGood === 'OK.') {
                    saveTaskData(tokenValid.id, pushToken, name[0], description[0], tag[0], date[0], time[0], files).
                        then(result => {
                            if (result) {
                                res.status(200).json({ title: 'Success', content: 'Task saved.' });
                            }
                            else {
                                res.status(500).json({ title: 'Error', content: 'Error saving the task. Try again later.' });
                            }
                        })
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

const saveTaskData = async (userId, pushToken, name, description, tag, date, time, files) => {
    if (files.image) {
        let insertResult = await insertTaskData(userId, pushToken, name, description, tag, date, time, files.image[0]);
        return insertResult;
    }
    else {
        let insertResult = await insertTaskData(userId, pushToken, name, description, tag, date, time);
        return insertResult;
    }
}

const saveImage = async (image, userId, task_id) => {
    let client = await db.getClient();
    let query = 'UPDATE task SET image = $1 WHERE task_id = $2';
    try {
        let path = `media/tasks/${userId}/${task_id}`;
        let absolutePath = `${path}/${image.originalFilename}`;
        await fse.ensureDir(path);
        await fse.copy(image.path, absolutePath);
        await fse.unlink(image.path);
        let params = [absolutePath, task_id];
        await client.query(query, params);
        return { path: absolutePath, success: true };
    } catch (err) {
        console.log(err);
        return { path: null, success: false };
    }
}

const insertTaskData = async (userId, pushToken, name, description, tag, date, time, file = null) => {
    let client = await db.getClient();
    let query = 'INSERT INTO task(user_id, name, description, complete_date, tag) VALUES($1, $2, $3, $4, $5) RETURNING task_id';
    let complete_date = `${date}T${time}`;
    let params = [userId, name, description, complete_date, tag];
    try {
        let result = await client.query(query, params);
        getClient().sendMessage(name, [pushToken], { send_date: `${date} ${time}`, timezone: 'America/Caracas', data: { task_id: result.rows[0].task_id } }, (error, response) => {
            if (!error) {
                insertOrder(client, result.rows[0].task_id, response.Messages[0]);
                if (file) {
                    saveImage(file, userId, result.rows[0].task_id);
                }
            }
        });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        client.release();
    }
}

const insertOrder = async (client, task_id, message_code) => {
    let query = 'INSERT INTO current_tasks(task_id, message_code) VALUES($1, $2) RETURNING current_task_id';
    let params = [task_id, message_code];
    let saveResult = await client.query(query, params);
    query = 'SELECT list_index FROM task_order order by list_index desc';
    let countResult = await client.query(query, []);
    let index = countResult.rowCount > 0 ? countResult.rows[0].list_index + 1 : 0;
    query = 'INSERT INTO task_order(current_task_id, list_index) VALUES($1, $2)';
    params = [saveResult.rows[0].current_task_id, index];
    client.query(query, params);
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