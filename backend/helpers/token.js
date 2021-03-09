const jwt = require("jsonwebtoken");
const database = require("./database")

const invalidToken = async (token) => {
    let client = await database.getClient();
    let bool = true;
    try{
        let text = "SELECT token FROM invalidTokens WHERE token = $1";
        let params = [token];
        let results = await client.query(text, params);
        if (results.rows.length < 1) { bool = false }
    }finally{
        await client.release();
    }
    return bool;
}

const verifyToken = async (token) => {
    let obj = {
        name: "",
        id: -1, 
        connected: false
    }
    if (!token){
        return obj;
    }
    else{
        let invalid = await invalidToken(token);
        if (invalid ){
            return obj;
        }
        else{
            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);
                obj.name = verified.name;
                obj.id = verified.id;
                obj.connected = true;
                return obj;
            } catch (error) {
                return obj;
            }
        }
    }
}

const invalidateToken = async (token) => {
    let client = await database.getClient();
    let text = "INSERT into invalidTokens(token) VALUES($1)";
    let params = [token];
    try{
        await client.query(text, params);
        return true;
    }catch{
        return false;
    }finally{
        client.release();
    }
}

module.exports = { verifyToken, invalidateToken }