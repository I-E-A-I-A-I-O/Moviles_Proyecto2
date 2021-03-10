const express = require('express');
const router = express.Router();

const {saveTask} = require('../controllers/saveTask');
const {completeTask} = require('../controllers/completeTask');
const {getCurrentTasks} = require('../controllers/getCurrentTasks');

router.post('/', saveTask);
router.put('/task/:taskId', completeTask);
router.get('/', getCurrentTasks);

module.exports = router;