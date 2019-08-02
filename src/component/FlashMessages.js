import React from 'react';
import './FlashMessages.css'

export const ErrorDisplay = (props) => {
    return (
        props.error ? <div className='bg-danger mb-0 message p-3 ' variant='danger'>
            {props.error}
        </div> : null
    )
}

export const SuccessDisplay = (props) => {
    return (
        props.success ?  <div className=' bg-success p-3 mb-0 message' variant='success'>
            {props.success}
        </div> : null
    )
}