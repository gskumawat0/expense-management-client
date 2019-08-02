import {GET_EXPENSES, UPDATE_EXPENSE, ADD_EXPENSE, DELETE_EXPENSE, UNDO_EXPENSE} from '../actionTypes'

const defaultExpenses = []; 

const expensesReducer = ({state = defaultExpenses }, action)=>{
    switch(action.type){
        case GET_EXPENSES:
            return action.expenses
        case ADD_EXPENSE:
            return [action.expense, ...state]
        case UPDATE_EXPENSE:
            return state.map((expense)=>
                expense._id !== action.expense._id ? expense : action.expense);
        default:
            return state
    }
}

export default expensesReducer;