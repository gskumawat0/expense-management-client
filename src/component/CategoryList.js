import React from 'react'

const CategoryList = (props)=>{
    let {categories, showEditModal, showDeleteModal} = props;
    return (
        categories.map(({category, _id})=>
            <li key={_id} className='category-items'> {category} 
                <span onClick={()=> showEditModal(category, _id)} 
                    className='float-left ml-1 mr-3'>
                    <i className='fas fa-edit'></i>
                </span>
                <span onClick={()=> showDeleteModal(_id) } 
                    className='text-danger mx-2 float-right'>
                    <i className='fas fa-trash-alt'></i></span>
            </li>)
    )
}

export default CategoryList;