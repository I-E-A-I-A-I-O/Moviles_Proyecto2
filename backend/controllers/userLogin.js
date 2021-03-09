const db = require('../helpers/database');
const bcrypt = require('bcrypt');
const mp = require('multiparty');
const jwt = require('jsonwebtoken');

const userLogin = (req, res) => {
    let form = new mp.Form();
    form.parse(req, (error, fields) => {
        if (error) {
            res.status(400).json({title: 'Error', content: 'Error reading form.'});
        }
        else{
            let {name, password} = fields;
            name = name[0];
            password = password[0];
            verifyCredentials(name, password).then(result => {
                if (result.result){
                    res.status(200).json({title: 'Success', content: result.token});
                }
                else{
                    res.status(403).json({title: 'Error', content: result.message});
                }
            })
        }
    });
}

const verifyCredentials = async (name, password) => {
    let client = await db.getClient();
    let query = 'SELECT user_id, name, password FROM users WHERE name = $1';
    let params = [name];
    try{
        let result = await client.query(query, params);
        if (result.rowCount > 0){
            let same = await bcrypt.compare(password, result.rows[0].password);
            if (same){
                let token = jwt.sign({name: name, id: result.rows[0].user_id}, process.env.JWT_SECRET);
                return {result: true, token: token, message: 'Login success.'};
            }
            else{
                return {result: false, token: null, message: 'Incorrect password.'};
            }
        }
        else{
            return {result: false, token: null, message: 'Username not found.'};
        }
    }catch(e){
        console.log(e);
        return {result: false, token: null, message: 'Error checking credentials.'};
    }finally{
        client.release();
    }
}

module.exports = {userLogin}