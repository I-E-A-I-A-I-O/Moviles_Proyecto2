const initialState = {
    deviceToken: ''
};

const deviceTokenReducer = (action = {type: ''}, state = initialState) => {
    switch(action.type){
        case 'SAVE_DEVICE_TOKEN':{
            return {
                ...state,
                deviceToken: action.deviceToken
            }
        }
        default:{
            return state;
        }
    }
};

export default deviceTokenReducer;