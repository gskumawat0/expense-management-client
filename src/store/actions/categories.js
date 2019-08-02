import { apiCall } from '../../services/api';
import { successHandler } from './success';
import { errorHandler } from './errors'

import { GET_CATEGORIES, ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "../actionTypes";


export const getCategories = (categories) => {
    return {
        type: GET_CATEGORIES,
        categories
    }
}

export const addCategory = (category) => {
    return {
        type: ADD_CATEGORY,
        category
    }
}

export const updateCategory = (category) => {
    return {
        type: UPDATE_CATEGORY,
        category
    }
}

export const deleteCategory = (categoryId) => {
    return {
        type: DEL_CATEGORY,
        categoryId
    }
}

export function categoryHandler(method, url, categoryData, actionType) {
    return dispatch => {
        return new Promise((resolve, reject)=>{
            return apiCall(method, `${process.env.REACT_APP_API_URL}/${url}`, categoryData)
                .then(({ success, message, ...data }) => {
                    if (success) {
                        switch (actionType) {
                            case 'getCategories':
                                dispatch(getCategories(data.categories));
                                break;
                            case 'addCategory':
                                dispatch(successHandler(message));
                                dispatch(addCategory(data.category));
                                break;
                            case 'updateCategory':
                                dispatch(successHandler(message));
                                dispatch(updateCategory(data.category));
                                break;
                            case 'deleteCategory':
                                dispatch(successHandler(message));
                                dispatch(deleteCategory(data.categoryId));
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