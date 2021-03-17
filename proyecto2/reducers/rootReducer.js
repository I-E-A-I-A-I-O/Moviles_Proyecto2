const initialState = {
    deviceToken: '',
    sessionToken: '',
    userData: {
        name: '',
        avatar: ''
    },
    tasksData: [],
    pinnedTasks: [],
    userStats: [0, 0, 0, 0]
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_DEVICE_TOKEN': {
            return {
                ...state,
                deviceToken: action.deviceToken
            }
        }
        case 'SAVE_SESSION_TOKEN': {
            return {
                ...state,
                sessionToken: action.sessionToken
            }
        }
        case 'SAVE_USER_DATA': {
            return {
                ...state,
                userData: action.userData
            }
        }
        case 'SAVE_TASKS_DATA': {
            return {
                ...state,
                tasksData: action.tasksData
            }
        }
        case 'SAVE_PINNED_TASKS': {
            return {
                ...state,
                pinnedTasks: action.pinnedTasks
            }
        }
        case 'MOVE_TO_PINNED': {
            return {
                ...state,
                pinnedTasks: [...state.pinnedTasks, state.tasksData.filter((value) => value.current_task_id === action.taskId)[0]],
                tasksData: state.tasksData.filter((value) => value.current_task_id !== action.taskId)
            }
        }
        case 'MOVE_TO_NORMAL': {
            return {
                ...state,
                tasksData: [...state.tasksData, addIndexToNewNormal(state, action.taskId)],
                pinnedTasks: state.pinnedTasks.filter((value) => value.current_task_id !== action.taskId)
            }
        }
        case 'SAVE_USER_STATS': {
            return {
                ...state,
                userStats: action.userStats
            }
        }
        default: {
            return state;
        }
    }
};

const addIndexToNewNormal = (state, taskId) => {
    let elementToPush = JSON.parse(JSON.stringify(state.pinnedTasks.filter((value) => value.current_task_id === taskId)[0]));
    if (state.tasksData.length > 0) {
        elementToPush.list_index = state.tasksData[state.tasksData.length - 1].list_index + 1;
    }
    else {
        elementToPush.list_index = 0;
    }
    return elementToPush;
}