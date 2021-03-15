const db = require('../helpers/database');
const tokenVerifier = require('../helpers/token');
const mp = require('multiparty');
const fse = require('fs-extra');
const bcrypt = require('bcrypt');

 
const editProfile = async (req,res) => {
    let token = req.headers.authtoken;
    let verified = await tokenVerifier.verifyToken(token);
    if (verified.connected){
        let form = new mp.Form();
        form.parse(req, (error, fields, files) => {
            if (error) {
                res.status(400).json({title: 'Error', content: 'Error reading form.'});
            }
            else{
                let {name, email, password} = fields;
                name = name[0];
                password = password[0];
                email = email[0];
                let salt = bcrypt.genSaltSync();
                password = bcrypt.hashSync(password, salt);
                saveUserData(verified.id, name, email, password, files).then(result => {
                    if (result.result){
                        res.status(200).json({title: 'Success', content: result});
                    }
                    else{
                        res.status(403).json({title: 'Error', content: "Error loading Data"});
                    }
                })
            }
        });
    }
}

const saveUserData = async (id, username, email, password, files) => {
    if (files.avatar){
        let result = await saveAvatar(files.avatar[0], username);
        if (result.success){
            let insertResult = await updateUserData(id, username, email, password, result.path);
            if (insertResult) {return true}
            else {
                await fse.remove(result.path);
                return false;
            }
        }
        else{
            return false;
        }
    }
    else{
        let insertResult = await updateUserData(id, username, email, password);
        return insertResult;
    }
}

const saveAvatar = async (avatar, username) => {
    try{
        let path = `media/avatars/${username}`;
        let absolutePath = `${path}/${avatar.originalFilename}`;
        if (fse.pathExistsSync(path)){
            return {path: null, success: false};
        }
        else{
            await fse.ensureDir(path);
            await fse.copy(avatar.path, absolutePath);
            await fse.unlink(avatar.path);
            return {path: absolutePath, success: true};
        }
    }catch(err){
        console.log(err);
        return {path: null, success: false};
    }
}

const updateUserData = async (id, name, email, password, avatarPath = null) => {
    let client = await db.getClient();
    let query = '';
    let params = [];
   
    if (avatarPath){
        query = "UPDATE users SET name = $1, email = $2, password = $3, avatar = $4 WHERE users_id = $5";
        params = [name, email, password, avatarPath, id];
    }
    else{
        query = "UPDATE users SET name = $1, email = $2, password = $3 WHERE users_id = $4";;
        params = [name, email, password,id];
    }
    try{
        await client.query(query, params);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }finally{
        client.release();
    }
}

module.exports = {editProfile};