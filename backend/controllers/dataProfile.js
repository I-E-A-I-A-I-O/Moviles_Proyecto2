const db = require('../helpers/database');
//const jwt = require('../helpers/token');
const mp = require('multiparty');
const fse = require('fs-extra');
const bcrypt = require('bcrypt');

// ----------------------- Cargar los datos al entrar en al perfil --------------------------//

const dataProfile = (req, res) => {
    let form = new mp.Form();
    form.parse(req, (error, fields) => {
        if (error) {
            res.status(400).json({title: 'Error', content: 'Error reading form.'});
        }
        else{
            let {name, password} = fields;
            name = name[0];
            password = password[0];
            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            requestDataUser(name, password).then(result => {
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

const requestDataUser = async (username, pass) => {
    let client = await db.getClient();
    let query = "SELECT name,email,password FROM users WHERE name = $1 AND password = $2";
    let params = [username, pass];
    try{
        let results = await client.query(query, params);
        if (results.rows[0].name === username || results.rows[0].password === pass){
            let data = {
                name: results.rows[0].name,
                email: results.rows[0].email,
                pass: results.rows[0].pass
            }
            return data;
        }
        else{
            console.warn("Error request of user data");
        }
    }catch(err){
        console.error(err);
    }finally{
        client.release();
    }
}

// -----------------------------------------------------------------------------------------------//

// ------------------------------------- Actualizacion de los datos en el perfil de usuario ---------------------------// 
const editProfile = (req,res) => {
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
            let salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            saveUserData(name, email, password, files).then(result => {
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

/*const updateData = async (username, pass, email, avatar) =>{
    let client = await db.getClient();
    let query ='';
    let params =[];
    
    
    query = "SELECT users:_id, name,email,password,avatar FROM users WHERE name = $1 AND password = $2";
    params = [username, pass];

    let result = client.query(query, params);
    if((await result).rows[0].name === username || (await result).rows[0].password === pass){
        query = "UPDATE users SET name ="+username+", email = "+email+", password = "+pass+" " 
    }
}*/

const saveUserData = async (username, email, password, files) => {
    if (files.avatar){
        let result = await saveAvatar(files.avatar[0], username);
        if (result.success){
            let insertResult = await updateUserData(username, email, password, result.path);
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
        let insertResult = await updateUserData(username, email, password);
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
    let salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    if (avatarPath){
        query = "UPDATE users SET name ="+name+", email = "+email+", password = "+pass+", avatar = "+avatarPath+" WHERE users_id = 1$";
        params = [id];
    }
    else{
        query = "UPDATE users SET name ="+name+", email = "+email+", password = "+pass+" WHERE users_id = 1$";;
        params = [id];
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

module.exports = {dataProfile, editProfile};