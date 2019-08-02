import { ADD_ERROR, REMOVE_ERROR } from '../actionTypes';

export const addError = (error) => ({
    type: ADD_ERROR,
    error
})

export const removeError = () => ({
    type: REMOVE_ERROR,
})

//remove error message after 5 seconds
export function errorHandler(message) {
    return dispatch => {
        dispatch(addError(message));
        setTimeout(() => dispatch(removeError()), 7000);
    };
}