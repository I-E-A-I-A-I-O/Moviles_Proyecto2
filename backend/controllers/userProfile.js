const db = require('../helpers/database');
const jwt = require('../helpers/token');
const fse = require('fs-extra');

const defaultAvatar = process.env.DEFAULT_AVATAR;

const getUserProfile = async (req, res) => {
    let token = req.headers.authtoken;
    let valid = await jwt.verifyToken(token);
    if (valid) {
        let avatar = await requestAvatar(valid.id);
        console.log(valid);
        res.status(200).json({ title: 'Success', content: { name: valid.name, avatar: avatar } });
    }
    else {
        res.status(403).json({ title: 'Error', content: 'Invalid token' });
    }
}

const getBase64String = async (path) => {
    try{
        let type = path.split(".")[1];
        let mimeType = `image/${type}`;
        let content = await fse.readFile(path, {encoding: 'base64'});
        return `data:${mimeType};base64,${content}`;
    }catch(err){
        console.error(err);
        return defaultAvatar;
    }
}

const requestAvatar = async (userId) => {
    let client = await db.getClient();
    let query = "SELECT avatar FROM users WHERE user_id = $1";
    let params = [userId];
    try {
        let results = await client.query(query, params);
        if (results.rows[0].avatar) {
            console.log(results.rows);
            return await getBase64String(results.rows[0].avatar);
        }
        else {
            return defaultAvatar;
        }
    } catch (err) {
        console.error(err);
        return defaultAvatar;
    } finally {
        client.release();
    }
}

module.exports = {getUserProfile}
