const db = require('../helpers/database');
const mp = require('multiparty');
const bcrypt = require('bcrypt');
const fse = require('fs-extra');

const registerUser = async (req, res) => {
    let form = new mp.Form();
    form.parse(req, (error, fields, files) => {
        if (error){
            res.status(400).json({title: 'Error', content: error.message});
        }
        else{
            let {name, email, password, confirm} = fields;
            name = name[0];
            email = email[0];
            password = password[0];
            confirm = confirm[0];
            let fieldVerify = verifyFields(name, email, password, confirm);
            if (fieldVerify !== 'OK.'){
                res.status(400).json({title: 'Error', content: fieldVerify});
            }
            else{
                saveUserData(name, email, password, files).then(result => {
                    if (result){res.status(200).json({title: 'Success', content: 'Account created!'});}
                    else{res.status(500).json({title: 'Error', content: 'Error creating the account.'});}
                });
            }
        }
    })
}

const saveUserData = async (username, email, password, files) => {
    if (files.avatar){
        let result = await saveAvatar(files.avatar[0], username);
        if (result.success){
            let insertResult = await insertUserData(username, email, password, result.path);
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
        let insertResult = await insertUserData(username, email, password);
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

const insertUserData = async (name, email, password, avatarPath = null) => {
    let client = await db.getClient();
    let query = '';
    let params = [];
    let salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    if (avatarPath){
        query = 'INSERT INTO users(name, email, password, avatar) VALUES($1, $2, $3, $4)';
        params = [name, email, password, avatarPath];
    }
    else{
        query = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3)';
        params = [name, email, password];
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

const verifyFields = (name, email, password, confirm) => {
    if (name.length < 1 || email.length < 1 || password.length < 1 || confirm.length < 1){
        return 'One or more fields empty.';
    }
    else if (name.length < 3 || name.length > 25){
        return 'Name must be between 3 and 25 characters.';
    }
    else if ((password.length < 5 || password.length > 30) || (confirm.length < 5 ||confirm.length > 30)){
        return 'Passwords must be between 5 and 30 characters.';
    }
    else if (password !== confirm){
        return 'Passwords do not match.';
    }
    else{
        return 'OK.';
    }
}

module.exports = {registerUser};