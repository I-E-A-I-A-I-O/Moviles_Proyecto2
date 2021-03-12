const db = require('../helpers/database');
const jwt = require('../helpers/token');

const dataProfile = (req,res) => {
    let token = req.headers.authtoken;
    let valid = await jwt.verifyToken(token);
    if (valid){
        let username = await requestDataUser(valid.name);
        console.log(valid);
        res.status(200).json({title: 'Success', content: {name: username}});
    }
    else{
        res.status(403).json({title: 'Error', content: 'Invalid token'});
    }
}

const requestDataUser = async (username) => {
    let client = await db.getClient();
    let query = "SELECT name,email,password FROM users WHERE name = $1";
    let params = [username];
    try{
        let results = await client.query(query, params);
        if (results.rows[0].name === username){
            let data = {
                name: results.rows[0],
                email: results.rows[1],
                pass: results.rows[2]
            }
            return data;
        }
        else{
            console.warn("successful request of user data");
        }
    }catch(err){
        console.error(err);
    }finally{
        client.release();
    }
}

module.exports = {dataProfile};