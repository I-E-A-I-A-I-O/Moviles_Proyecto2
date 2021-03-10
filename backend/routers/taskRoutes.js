const express = require('express');
const router = express.Router();

const {saveTask} = require('../controllers/saveTask');
const {completeTask} = require('../controllers/completeTask');

router.post('/', saveTask);
router.put('/task/:taskId', completeTask);

module.exports = router;