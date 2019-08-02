import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ErrorDisplay, SuccessDisplay} from '../component/FlashMessages';
import Spinner from '../component/Spinner';
import {profileHandler} from '../store/actions/profile';
import {errorHandler} from '../store/actions/error';
import './Profile.css';

const defaultState = {
    totalBudget: 10000,
    firstName: '',
    lastName: '',
    isSubmitting: false
}

class Profile extends Component{
    state= {...defaultState}
    componentDidMount(){
        this.props.profileHandler('get', '/profile', undefined, 'getProfile' )
    }
    componentWillReceiveProps({profile}){
        this.setState({
            ...profile
        })
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitProfile = (e)=>{
        e.preventDefault();
        let {firstName, lastName, totalBudget} = this.state;
        totalBudget  = parseInt(totalBudget)
        if(totalBudget <= 0){
            this.props.errorHandler('budget should be freater than 0');
            return false;
        }
        
        this.setState({
            isSubmitting: true
        })
        
        this.props.profileHandler('put', '/profile', {firstName, lastName, totalBudget}, 'updateProfile')
        .then(()=> this.setState({
            isSubmitting: false
        }))
        .catch(()=> this.setState({
            isSubmitting: false
        }))
    }
    render(){
        let { error, success} = this.props;
        let {isSubmitting, totalBudget, firstName, lastName} = this.state
        return(
            <div>
                {error ? <ErrorDisplay error={error} />: null}
                {success ? <SuccessDisplay success={success} /> : null}
                {isSubmitting ? <Spinner /> : null}
                <div className='w-75 mx-auto'>
                    <h1 className='h3 m-4 p-3 text-center'>My Profile</h1>
                    <form onSubmit={this.submitProfile}>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label htmlFor='firstName'> First Name:
                                        <input name='firstName' value={firstName} placeholder='first name' 
                                            onChange={this.handleChange} className='form-control' id='firstName' />
                                    </label>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='form-group'>
                                    <label htmlFor='lastName'> Last Name: 
                                        <input name='lastName' value={lastName} placeholder='last name' 
                                            onChange={this.handleChange} className='form-control' id='lastName' />
                                    </label>
                                    
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='form-group col'>
                                <label htmlFor='totalBudget'> Total Budget:
                                    <input type='number' name='totalBudget' value={totalBudget} placeholder='total budget' onChange={this.handleChange}
                                        className='form-control'  />
                                </label>
                                
                            </div>
                        </div>
                        
                        <div>
                            <button className='btn btn-primary'>Update</button>
                        </div>
                    </form>    
                </div> 
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        error: state.error,
        success: state.success
    }
}

export default connect(mapStateToProps, {profileHandler, errorHandler})(Profile);