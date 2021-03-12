const express = require('express');
const router = express.Router();

const {getUserProfile} = require('../controllers/userProfile');
const { dataProfile } = require('../controllers/dataProfile')

router.get('/user', getUserProfile);
router.post("/dataProfile", dataProfile);

module.exports = router;