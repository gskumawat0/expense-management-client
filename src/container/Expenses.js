import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ErrorDisplay, SuccessDisplay} from '../component/FlashMessages';
import {Modal} from 'react-bootstrap';
import Spinner from '../component/Spinner';
import {profileHandler} from '../store/actions/profile';
import {categoryHandler} from '../store/actions/categories';
import {expenseHandler} from '../store/actions/expenses';
import {errorHandler} from '../store/actions/error';
import Chart from "chart.js";
// import classes from "./LineGraph.module.css";
import './Expenses.css';

const colorArray = ['#9966CC', '#0000FF', '	#DE3163', '	#008000', '	#C8A2C8', '	#483C32', '	#3F00FF', '	#0F52BA', '	#4B0082', '	#7B3F00']
                    .sort(()=> Math.random() > 0.5)

const defaultState = {
    itemName: '',
    category: '',
    amount: '',
    showModal: false,
    expenseId: '',
    isSubmitting: false
}



class Expenses extends Component{
    state = {...defaultState}
    SummaryRef = React.createRef();
    CategoryRef = React.createRef()
    
    componentDidMount(){
        this.props.profileHandler('get', '/profile', undefined, 'getProfile' )
        this.props.categoryHandler('get', '/categories', undefined, 'getCategories' )
        this.props.expenseHandler('get', '/expenses', undefined, 'getExpenses' )

    }

    renderExpenseList = ()=>{
        let {expenses} = this.props;
        let expenseList = expenses.map((expense)=>
            <tr key={expense._id} className={expense.active ? '': 'deleted-item' }>
                <td>{expense.category}</td>
                <td>{expense.itemName}</td>
                <td>{expense.amount}</td>
                <td>{new Date(expense.date).toDateString()}</td>
                <td>{expense.active ? 
                    <span >
                        <i className='fas fa-trash-alt mx-3' onClick={this.deleteExpense.bind(this, expense._id)}></i>
                        <i className='fas fa-edit mx-3' onClick={this.showEditModal.bind(this, expense._id)}></i>
                        </span> : 
                    <span onClick={this.undoDeletedExpense.bind(this, expense._id)}><i className='fas fa-undo'></i></span>}</td>
            </tr>)
        return (
            <table className='table my-2 table-hover'>
                <thead>
                    <tr>
                        <th scope='col'>Category</th>
                        <th scope='col'>Item Name</th>
                        <th scope='col'>Amount</th>
                        <th scope='col'>Date</th>
                        <th scope='col'></th>
                    </tr>
                </thead>
                <tbody>
                    {expenseList}
                </tbody>
            </table>
        )
    } 


    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showEditModal = (expenseId)=>{
        let {category, itemName, amount} = this.props.expenses.find((expense)=>
            expense._id === expenseId)
        this.setState({
            category, itemName, amount, showModal: true, expenseId
        })
    }


    closeModal = (e)=>{
        this.setState({
            ...defaultState,
        })
    }

    submitExpense = (e, hfdsh)=>{
        e.preventDefault();
        let {itemName, amount, category, expenseId} = this.state;
        // debugger
        if(!itemName || !amount || !category){
            this.props.errorHandler('please enter all fields');
            return false;
        }
        this.setState({
            isSubmitting: true
        })
        let promise;
        if(expenseId){
            promise = this.props.expenseHandler('put', `/expenses/${expenseId}`, {itemName, amount, category}, 'updateExpense');
        }
        else{
            promise = this.props.expenseHandler('post', `/expenses/`, {itemName, amount, category}, 'addExpense');

        }
        promise.then(()=> this.setState({
            ...defaultState
        }))
        .catch(()=> this.setState({
            isSubmitting: false
        }))
    }

    deleteExpense = (expenseId)=>{
        this.setState({
            isSubmitting: true
        })
        this.props.expenseHandler('delete', `/expenses/${expenseId}`, undefined, 'updateExpense')
        .then(()=> this.setState({
            isSubmitting: false
        }))
        .catch(()=> this.setState({
            isSubmitting: false
        }))
    }

    undoDeletedExpense = (expenseId)=>{
        this.setState({
            isSubmitting: true
        })
        this.props.expenseHandler('get', `/expenses/${expenseId}/undo`, undefined, 'updateExpense')
        .then(()=> this.setState({
            isSubmitting: false
        }))
        .catch(()=> this.setState({
            isSubmitting: false
        }))
    }

    createSummaryChart = ()=>{
        let summaryChartContext = this.SummaryRef.current.getContext('2d');
        let spentBudget = 0;
        let {totalBudget} = this.props; 
        if(this.summaryChart){
            this.summaryChart.destroy();
        }
        for (let expense of this.props.expenses){
            if(!expense.active){
                continue;
            }
            spentBudget += parseInt(expense.amount) ;
        }

        let remainingBudget = totalBudget - spentBudget;
        if (remainingBudget < 0){
            remainingBudget = 0
        }

        let data =  {
            datasets: [{
                data: [spentBudget, remainingBudget],
                backgroundColor: ['red', 'green']
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Spend', 'Remaining'
            ]
        };

        this.summaryChart =  new Chart(summaryChartContext, {
            type: 'pie',
            data: data,
            options: {
                cutoutPercentage: 0,
                animation:{
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    createCategoryChart = ()=>{
        let categoryChartContext = this.CategoryRef.current.getContext('2d');
        let categoryWiseExpenses = {}
        if(this.categoryChart){
            this.categoryChart.destroy()
        }
        for (let {category, amount, active} of this.props.expenses){
            if(!active){
                continue;
            }
            if(categoryWiseExpenses[category]){
                categoryWiseExpenses[category] += parseInt(amount);
            }
            else {
                categoryWiseExpenses[category] = parseInt(amount)
            }
        }
        let data =  {
            datasets: [{
                data: Object.values(categoryWiseExpenses),
                backgroundColor: colorArray
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: Object.keys(categoryWiseExpenses)
        };
        this.categoryChart = new Chart(categoryChartContext, {
            type: 'pie',
            data: data,
            options: {
                cutoutPercentage: 0,
                animation:{
                    animateRotate: true,
                    animateScale: true
                }
            }
        });

    }

    render(){
        let {error, success, categories, expenses} = this.props;
        let {isSubmitting, itemName, category, amount,  showModal} = this.state
        return(
            <div className=''>
                {error ? <ErrorDisplay error={error} />: null}
                {success ? <SuccessDisplay success={success} /> : null}
                {isSubmitting ? <Spinner /> : null}

                <h1 className='m-3 p-3 text-center'>My Expenses</h1>
                <div className='row'>
                    <div  className='col-6'>
                        <canvas id='summary' ref={this.SummaryRef} />
                        { this.SummaryRef.current ? this.createSummaryChart() : null}
                        <p className='text-center'>Expenses Summary</p>
                    </div>
                    <div  className='col-6'>
                        <canvas id='category' ref={this.CategoryRef} />
                        { this.CategoryRef.current ?  this.createCategoryChart() : null}
                        <p className='text-center'>Category wise Expenses</p>
                    </div>
                </div>

                <div className='clearfix'>
                    <button className='btn btn-primary float-right' onClick={()=> this.setState({showModal: true})}>Add Expense</button>
                </div>

                {expenses.length > 0 ?
                    this.renderExpenseList()
                    : <p>Expenses Not Found</p>}

                <Modal size='lg' centered show={showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Expenses</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.submitExpense}>
                            <div className='form-group'>
                                <label>Category:
                                    <select onChange={this.handleChange} value={category} name='category' className='form-control'>
                                        <option value=''> select category</option>
                                        {categories.map(({category, _id})=>
                                            <option value={category} key={_id}>{category}</option>)}
                                    </select>
                                </label>
                            </div>
                            <div className='form-group'>
                                <label> Item Name:
                                    <input name='itemName' value={itemName} onChange={this.handleChange} placeholder='item name' 
                                        className='form-control' />
                                </label>
                            </div>
                            <div className='form-group'>
                                <label> Amount:
                                    <input type='number' name='amount' value={amount} onChange={this.handleChange} placeholder='amount'
                                        className='form-control' />
                                </label>
                            </div>
                            <div>
                                <button className='btn btn-primary mx-2' type='submit'> Submit</button>
                                <button className='btn btn-secondary mx-2' onClick={this.closeModal.bind(this, 123)} type='button'> Close</button>
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
        totalBudget: state.profile.totalBudget,
        categories: state.categories,
        expenses: state.expenses

    }
}

export default connect(mapStateToProps, {expenseHandler, profileHandler, errorHandler, categoryHandler})(Expenses);