import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ErrorDisplay, SuccessDisplay} from '../component/FlashMessages';
import {Modal, Button} from 'react-bootstrap';
import Spinner from '../component/Spinner';
import CategoryList from "../component/CategoryList";
import {profileHandler} from '../store/actions/profile';
import {categoryHandler} from '../store/actions/categories';
import {errorHandler} from '../store/actions/error';
import './Setting.css'

const defaultState = {
    category: '',
    isSubmitting: false,
    totalBudget: 10000,
    showDeleteModal: false,
    showEditModal: false
}

class Setting extends Component{
    state={...defaultState}

    componentDidMount(){
        this.props.profileHandler('get', '/profile', undefined, 'getProfile' )
        this.props.categoryHandler('get', '/categories', undefined, 'getCategories' )

    }
    componentWillReceiveProps({totalBudget }){
        this.setState({
            totalBudget
        })
    }


    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showEditModal = (category, categoryId)=>{
        this.setState({
            category, categoryId, showEditModal: true
        })
    }

    showDeleteModal = (categoryId)=>{
        this.setState({
            categoryId,
            showDeleteModal: true
        })
    }

    closeModal = ()=>{
        this.setState({
            ...defaultState,
            totalBudget: this.props.totalBudget
        })
    }

    submitBudget = (e)=>{
        e.preventDefault();
        let { totalBudget} = this.state;
        totalBudget  = parseInt(totalBudget)
        if(totalBudget <= 0){
            this.props.errorHandler('budget should be freater than 0');
            return false;
        }
        
        this.setState({
            isSubmitting: true
        })
        
        this.props.profileHandler('put', '/profile', {totalBudget}, 'updateProfile')
        .then(()=> this.setState({
            isSubmitting: false
        }))
        .catch(()=> this.setState({
            isSubmitting: false
        }))
    }

    submitCategory = (e)=>{
        e.preventDefault();
        let {category, categoryId} = this.state;
        if(!category){
            this.props.errorHandler('please enter category');
            return false
        }
        this.setState({
            isSubmitting: true
        })
        let promise;
        if(categoryId){
            promise = this.props.categoryHandler('put', `/categories/${categoryId}`, {category}, 'updateCategory')
        }
        else{
            promise = this.props.categoryHandler('post', '/categories', {category}, 'addCategory')
        }
        promise
            .then(()=> this.setState({
                ...defaultState,
                totalBudget: this.props.totalBudget
            }))
            .catch(()=> this.setState({isSubmitting: false}))
    }

    deleteCategory = ()=>{
        let {categoryId} = this.state;
        if(!categoryId){
            this.props.errorHandler('something went wrong.');
            return false;
        }
        this.props.categoryHandler('delete', `/categories/${categoryId}`, undefined, 'deleteCategory')
            .then(()=> this.setState({
                ...defaultState,
                totalBudget: this.props.totalBudget
            }))
            .catch(()=> this.setState({isSubmitting: false}))
    }

    


    render(){
        let {error, success, categories} = this.props;
        let {category, totalBudget, isSubmitting, showDeleteModal, showEditModal} = this.state;
        return(
            <div>
                {error ? <ErrorDisplay error={error} />: null}
                {success ? <SuccessDisplay success={success} /> : null}
                {isSubmitting ? <Spinner /> : null}

                <div className=''>
                    <h1 className='m-4 p-4 text-center'> Settings</h1>
                    <form onSubmit={this.submitBudget} className='mb-3 '>
                        <div className='row'>
                            <div className='col-2 text-left'>total Budget</div>
                            <div className='col-4 text-center'>
                                <input name='totalBudget' value={totalBudget}  onChange={this.handleChange} className='form-control'/>
                            </div>
                            <div className='col-6 text-left'>
                                <button type='submit' className='btn btn-primary'>Update</button>
                            </div>
                        </div>
                    </form>
                    <form onSubmit={this.submitCategory} className='mb-3'>
                        <div className='row'>
                            <div className='col-2 text-left'>Category</div>
                            <div className='col-4 text-center'>
                                <input name='category' value={category}  onChange={this.handleChange} className='form-control'
                                    placeholder='enter category'/>
                            </div>
                            <div className='col-6 text-left'>
                                <button type='submit' className='btn btn-primary'>Add Category</button>
                            </div>
                        </div>
                    </form>
                    <div>
                        <h1 className='h4'>Categories</h1>
                        {categories.length > 0 ? 
                            <ul className='category-list'>
                                <CategoryList 
                                categories={categories}
                                showDeleteModal={this.showDeleteModal}
                                showEditModal={this.showEditModal} />
                            </ul>
                            : <p>No category found</p>}
                    </div>
                </div>
                
                <Modal show={showDeleteModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you Sure?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={this.deleteCategory}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEditModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.submitCategory}>
                            <div className='form-group'>
                                <label> Category:
                                    <input name='category' value={category} onChange={this.handleChange} placeholder='enter category' 
                                        className='form-control' />
                                </label>
                            </div>
                            <div>
                            <Button variant="primary" onClick={this.closeModal}>
                                Cancel
                            </Button>
                            <Button variant="warning" type='submit'>
                                Update
                            </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>


            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        error: state.error,
        success: state.success,
        categories: state.categories,
        totalBudget: state.profile.totalBudget
    }
}

export default connect(mapStateToProps, {profileHandler, errorHandler, categoryHandler})(Setting);