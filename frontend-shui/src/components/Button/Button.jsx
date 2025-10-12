
import React from 'react';
import './button.css';

const Button = ({ text, onClick, type = "button", className = "" }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            className={`btn ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;