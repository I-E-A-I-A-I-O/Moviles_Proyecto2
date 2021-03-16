const express = require('express');
const router = express.Router();

const {getUserProfile} = require('../controllers/userProfile');
const { editProfile} = require('../controllers/dataProfile');
const {userStats} = require('../controllers/stastsUser')

router.get('/user', getUserProfile);
router.post('/editProfile', editProfile);
router.get('/userStats', userStats);

module.exports = router;