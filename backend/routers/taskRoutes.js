const express = require('express');
const router = express.Router();

const { saveTask } = require('../controllers/saveTask');
const { completeTask } = require('../controllers/completeTask');
const { getCurrentTasks } = require('../controllers/getCurrentTasks');
const { updateOrder } = require('../controllers/updateTaskOrder');

router.post('/', saveTask);
router.get('/', getCurrentTasks);
router.put('/', updateOrder);
router.put('/task/:taskId', completeTask);

module.exports = router;