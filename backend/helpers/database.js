const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PGCONNECTION_STRING,
    ssl:{
        rejectUnauthorized: false,
    },
    idleTimeoutMillis: 1000,
    min: 0,
    query_timeout: 5000
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