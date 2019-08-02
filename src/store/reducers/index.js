import { combineReducers } from 'redux';
import errorReducer from './error';
import successReducer from './success';
import profileReducer from './profile'
import categoriesReducer from './categories';
import expensesReducer from './expenses';

const rootReducer = combineReducers({
    error: errorReducer,
    success: successReducer,
    profile: profileReducer,
    expenses: expensesReducer,
    categories: categoriesReducer
});


export default rootReducer;