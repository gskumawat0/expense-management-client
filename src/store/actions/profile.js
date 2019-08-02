import {GET_PROFILE} from '../actionTypes'
import { successHandler } from './success';
import { errorHandler } from './error';
import { apiCall } from '../../services/api';


export const getProfile = (profile)=>{
    return {
        type: GET_PROFILE,
        profile
    }
}

export const profileHandler =  (method, url, profileData, actionType)=>{
    return dispatch =>{
        return new Promise((resolve, reject) =>{
            return apiCall(method, `${process.env.REACT_APP_API_URL}${url}`, profileData)
                .then(({success,message, ...data}) => {
                    if(success){
                        switch(actionType){
                            case 'getProfile':
                                dispatch(getProfile(data.profile))
                                break;
                            case 'updateProfile':
                                dispatch(successHandler(message));
                                dispatch(getProfile(data.profile));
                                break;
                            default:
                                return null
                        }
                        resolve()
                    }
                    else{
                        throw Error(message);
                    }
                })
                .catch((err)=>{
                    dispatch(errorHandler(err.message || err || 'something went wrong'));
                    reject()
                })
        })
    }
}