import {GET_PROFILE} from '../actionTypes'

const defaultProfile ={
    firstName: 'john',
    lastName: 'doe',
    totalBudget: 0
} 

const profileReducer = ({state = defaultProfile }, action)=>{
    switch(action.type){
        case GET_PROFILE:
            return {...state, ...action.profile}
        default:
            return state
    }
}

export default profileReducer;