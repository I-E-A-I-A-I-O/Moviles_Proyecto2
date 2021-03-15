const express = require('express');
const router = express.Router();

const { saveTask } = require('../controllers/saveTask');
const { completeTask } = require('../controllers/completeTask');
const { getCurrentTasks } = require('../controllers/getCurrentTasks');
const { updateOrder } = require('../controllers/updateTaskOrder');
const { getTask } = require('../controllers/getTaskData');
const { editTask } = require('../controllers/editTask');

router.post('/', saveTask);
router.get('/', getCurrentTasks);
router.put('/', updateOrder);
router.put('/task/:taskId', completeTask);
router.get('/task/:taskId', getTask);
router.put('/task/:taskId/:type', editTask)

module.exports = router;