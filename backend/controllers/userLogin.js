const db = require('../helpers/database');
const bcrypt = require('bcrypt');

const userLogin = (req, res) => {
    //Logica de login aqui
    res.status(200).send('Hola');
}

module.exports = {userLogin}