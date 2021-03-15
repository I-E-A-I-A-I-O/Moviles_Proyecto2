const db = require('../helpers/database');
const tokenValid = require('../helpers/token');
const mp = require('multiparty');
const pw = require('../controllers/pushWooshAPI');
const fse = require('fs-extra');

const editTask = async (req, res) => {
    const { taskId, type } = req.params;
    let token = req.headers.authtoken;
    let pushToken = req.headers.pushtoken;
    let isValid = await tokenValid.verifyToken(token);
    if (isValid.connected) {
        if (type === 'name' || type === 'description' || type === 'tag') {
            editData(taskId, req, type, res);
        }
        else if (type === 'date' || type == 'time') {
            editDate(taskId, req, res, type, pushToken);
        }
        else if (type === 'image') {
            editImage(req, res, taskId, isValid.id);
        }
        else {
            req.status(400).json({ title: 'error', content: '???' });
        }
    }
    else {
        res.status(403).json({ title: 'error', content: 'invalid token' });
    }
}

const editImage = async (req, res, taskId, userId) => {
    let client = await db.getClient();
    try {
        let query = 'SELECT image FROM task WHERE task_id = $1';
        let results = await client.query(query, [taskId]);
        let path = `media/tasks/${userId}/${taskId}`;
        await fse.emptydir(path);
        let form = new mp.Form();
        form.parse(req, (error, fields, files) => {
            if (error) {
                res.status(500).json({ title: 'error', content: 'Error reading image.' });
            }
            else {
                let absolutePath = `${path}/${files.image[0].originalFilename}`;
                fse.copyFileSync(files.image[0].path, absolutePath);
                fse.unlink(files.image[0].path);
                if (!results.rows[0].image) {
                    query = 'UPDATE task SET image = $1 WHERE task_id = $2';
                    client.query(query, [absolutePath, taskId]);
                }
                res.status(200).json({ title: 'success', content: 'Image updated.' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ title: 'error', content: 'Error updating the image.' });
    } finally {
        client.release();
    }
}

const editDate = async (taskId, req, res, type, pushtoken) => {
    let client = await db.getClient();
    let query = 'SELECT complete_date, message_code, t.name FROM task t INNER JOIN current_tasks ct on t.task_id = ct.task_id WHERE t.task_id = $1';
    let params = [taskId];
    try {
        let results = await client.query(query, params);
        if (results.rowCount > 0) {
            let form = new mp.Form();
            form.parse(req, (error, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ title: 'error', content: "Error reading data." });
                }
                else {
                    (async () => {
                        let pwClient = pw.getClient();
                        let param;
                        let dateString;
                        if (type === 'date') {
                            let { date } = fields;
                            param = results.rows[0].complete_date.split(' ')[1];
                            dateString = `${date[0]} ${param}`;
                        }
                        else if (type === 'time') {
                            let { time } = fields;
                            param = results.rows[0].complete_date.split(' ')[0];
                            dateString = `${param} ${time[0]}`;
                        }
                        query = 'UPDATE task SET complete_date = $1 WHERE task_id = $2';
                        params = [dateString, taskId];
                        await client.query('BEGIN', []);
                        await client.query(query, param);
                        pwClient.sendMessage(results.rows[0].name, pushtoken,
                            {
                                send_date: dateString,
                                timezone: 'America/Caracas',
                                data: {
                                    task_id: taskId
                                }
                            }, (err, response) => {
                                (async () => {
                                    if (err) {
                                        console.error(err);
                                        await client.query('ROLLBACK', []);
                                        res.status(500).json({ title: 'error', content: 'Could not save changes.' });
                                    }
                                    else {
                                        query = 'UPADTE current_tasks SET message_code = $1 WHERE task_id = $2';
                                        params = [response.Messages[0], taskId];
                                        await client.query(query, params);
                                        await client.query('COMMIT', []);
                                        res.status(200).title({ title: 'success', content: 'Changes saved.' });
                                        pwClient.deleteMessage(results.rows[0].message_code, (error, response) => { })
                                    }
                                })()
                            })
                    })()
                }
            })
        }
        else {
            res.status(403).json({ title: 'error', content: "Task already completed." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ title: 'error', content: 'Error saving changes.' });
    } finally {
        client.release();
    }
}

const editData = async (taskId, req, type, res) => {
    let client = await db.getClient();
    let form = new mp.Form();
    form.parse(req, (error, fields) => {
        if (error) {
            console.error(error);
            res.status(500).json({ title: 'error', content: 'Error parsing form.' });
            return false;
        }
        else {
            let param;
            let query = `UPDATE task SET ${type} = $1 WHERE task_id = $2`;
            let params;
            if (type === 'name') {
                let { name } = fields;
                param = name[0];
            }
            else if (type === 'description') {
                let { description } = fields;
                param = description[0];
            }
            else if (type === 'tag') {
                let { tag } = fields;
                param = tag[0];
            }
            params = [param, taskId];
            try {
                (async () => {
                    await client.query(query, params);
                    res.status(200).json({ title: 'success', content: 'Changes saved.' });
                })()
            } catch (err) {
                console.error(err);
                res.status(500).json({ title: 'error', content: 'Error saving changes.' });
            } finally {
                client.release();
            }
        }
    });
}

module.exports = {
    editTask
}