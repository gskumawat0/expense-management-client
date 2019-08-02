import { apiCall } from '../../services/api';
import { successHandler } from './success';
import { errorHandler } from './error'

import { GET_EXPENSES, ADD_EXPENSE, UPDATE_EXPENSE, } from "../actionTypes";


export const getExpenses = (expenses) => {
    return {
        type: GET_EXPENSES,
        expenses
    }
}

export const addExpense = (expense) => {
    return {
        type: ADD_EXPENSE,
        expense
    }
}

export const updateExpense = (expense) => {
    return {
        type: UPDATE_EXPENSE,
        expense
    }
}



export function expenseHandler(method, url, expenseData, actionType) {
    return dispatch => {
        return new Promise((resolve, reject)=>{
            return apiCall(method, `${process.env.REACT_APP_API_URL}${url}`, expenseData)
                .then(({ success, message, ...data }) => {
                    if (success) {
                        // debugger
                        switch (actionType) {
                            case 'getExpenses':
                                dispatch(getExpenses(data.expenses));
                                break;
                            case 'addExpense':
                                dispatch(successHandler(message));
                                dispatch(addExpense(data.expense));
                                break;
                            case 'updateExpense':
                                dispatch(successHandler(message));
                                dispatch(updateExpense(data.expense));
                                break;
                            default:
                                return null;
                        }
                        resolve()
                    }
                    else {
                        throw Error(message)
                    }
                })
                .catch((err) => {
                    dispatch(errorHandler(err.message || err || `something went wrong`))
                    reject()
                });
            })
    };
}