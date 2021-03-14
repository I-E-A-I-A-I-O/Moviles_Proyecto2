const db = require('../helpers/database');
const tokenValid = require('../helpers/token');
const fse = require('fs-extra');

const getTask = async (req, res) => {
    let token = req.headers.authtoken;
    let taskId = req.params.taskId;
    let isValid = await tokenValid.verifyToken(token);
    if (isValid.connected) {
        let client = await db.getClient();
        try {
            let query = "SELECT name, description, complete_date, image, tag FROM task WHERE task_id = $1 AND user_id = $2";
            let params = [taskId, isValid.id];
            let results = await client.query(query, params);
            if (results.rowCount > 0) {
                let data = {
                    name: results.rows[0].name,
                    description: results.rows[0].description.length > 0 ? results.rows[0].description : null,
                    tag: results.rows[0].tag.length > 0 ? results.rows[0].tag : null,
                    date: results.rows[0].complete_date,
                    image: results.rows[0].image ? getImage(results.rows[0].image) : null
                };
                res.status(200).json({ title: 'success', content: data });
            }
            else {
                res.status(400).json({ title: 'Error', content: "Nope" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ title: 'error', content: "Couldn't retrieve data" });
        } finally {
            client.release();
        }
    }
    else {
        res.status(403).json({ title: 'Error', content: "Can't show you that!" });
    }
}

const getImage = (path) => {
    try {
        let mimeType = `image/${path.split(".")[1]}`;
        let content = fse.readFileSync(path, { encoding: 'base64' });
        return `data:${mimeType};base64,${content}`;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    getTask
}