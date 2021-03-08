const express = require('express');
const router = express.Router();

const {registerUser} = require('../controllers/registerUser');
const {userLogin} = require('../controllers/userLogin');

router.post('/', registerUser);
router.post('/user', userLogin);

module.exports = router;