const express = require('express');
const router = express.Router();

const {getUserProfile} = require('../controllers/userProfile');
const { dataProfile, editProfile } = require('../controllers/dataProfile')

router.get('/user', getUserProfile);
router.post("/dataProfile", dataProfile);
router.post("/editProfile", editProfile);

module.exports = router;