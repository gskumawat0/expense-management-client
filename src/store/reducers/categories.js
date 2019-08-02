import {GET_CATEGORIES, UPDATE_CATEGORY, ADD_CATEGORY, DELETE_CATEGORY} from '../actionTypes'

const defaultCategories = []; 

const categoriesReducer = ({state = defaultCategories }, action)=>{
    switch(action.type){
        case GET_CATEGORIES:
            return action.categories
        case ADD_CATEGORY:
            return [action.category, ...state]
        case UPDATE_CATEGORY:
            return state.map((category)=>
                category._id !== action.category._id ? category : action.category);
        case DELETE_CATEGORY:
            return state.filter((category)=>
                category._id !== action.categoryId)
        default:
            return state
    }
}

export default categoriesReducer;