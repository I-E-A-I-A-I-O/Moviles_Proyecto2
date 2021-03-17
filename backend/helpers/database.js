const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PGCONNECTION_STRING,
});

pool.on('error', (error, client) => {
    console.log(error);
});

const getClient = async () => {
    return await pool.connect();
}

module.exports = {
    getClient
}