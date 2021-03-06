const express = require('express');
const router = express.Router();

const {registerClient} = require('../controllers/pushWooshAPI');

router.post('/', registerClient);

module.exports = router;