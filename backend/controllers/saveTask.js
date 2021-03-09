const db = require('../helpers/database');
const jwt = require('../helpers/token');
const mp = require('multiparty');

const saveTask = async (req, res) => {
    let token = req.headers.authtoken;
    let tokenValid = await jwt.verifyToken(token);
    if (tokenValid.connected) {
        let form = new mp.Form();
        form.parse(req, (error, fields, files) => {
            if (error) {
                res.status(400).json({ title: 'Error', content: 'Error parsing form data' });
            }
            else {
                let { name, description, tag, date, time } = fields;
                res.status(200).send('asdasdasd');
            }
        });
    }
    else {
        res.status(403).json({ title: 'Error', content: 'Access denied.' });
    }
}

module.exports = { saveTask };