const express = require('express');
const router = express.Router();

const {saveTask} = require('../controllers/saveTask');

router.post('/', saveTask);

module.exports = router;