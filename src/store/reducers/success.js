import { ADD_SUCCESS, REMOVE_SUCCESS } from '../actionTypes'

const successReducer = (state = null, action) => {
    switch (action.type) {
        case ADD_SUCCESS:
            return  action.success ;
        case REMOVE_SUCCESS:
            return null
        default:
            return state;
    }
};

export default successReducer;