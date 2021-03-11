export const normalToPinned = (taskId) => ({
    type: 'MOVE_TO_PINNED',
    taskId: taskId
});