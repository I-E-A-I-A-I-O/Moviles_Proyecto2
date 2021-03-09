const express = require('express');
const router = express.Router();

const {getUserProfile} = require('../controllers/userProfile');

router.get('/user', getUserProfile);

module.exports = router;