const initialState = {
    deviceToken: '',
    sessionToken: '',
    userData: {
        name: '',
        avatar: ''
    },
    tasksData: []
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
        default: {
            return state;
        }
    }
};