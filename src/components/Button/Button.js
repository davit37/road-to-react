import React from 'react';
import PropTypes from 'prop-types';

// style
import './Button.scss';

const Button  = ({onClick, className ='', children})=>(

    <button
        onClick={onClick}
        className={className}
        type='button'
        >
            {children}
        </button>

);
Button.defaultProp = {
    className:'',
}
Button.propTypes = {
    onClick : PropTypes.func.isRequired,
    className : PropTypes.string,
    children : PropTypes.node.isRequired,
}
export default Button;