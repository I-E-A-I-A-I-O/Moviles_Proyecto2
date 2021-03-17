const express = require('express');
const router = express.Router();

const {getUserProfile} = require('../controllers/userProfile');
const { editProfile} = require('../controllers/editProfile');
const {userStats} = require('../controllers/userStasts')

router.get('/user', getUserProfile);
router.post('/editProfile', editProfile);
router.get('/userStats', userStats);

module.exports = router;