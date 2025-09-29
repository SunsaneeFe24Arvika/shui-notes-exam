import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './registerForm.css';
import { registerApi } from '../../api/auth';

const RegisterForm = ({ toggleForm }) => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordRepeatRef = useRef();

    const registerUser = async (e) => {
        e.preventDefault();
        const result = await registerApi({
            username : usernameRef.current.value,
            password : passwordRef.current.value,
            email : emailRef.current.value,
            role : 'GUEST'
        });

        if(result.status === 201) {
            toggleForm('LOGIN');
        } else {
            console.log(result);
        }
    }

    return (
        <form className="form">
            <h1 className="form__title">Register Account</h1>
            <label className="form__label">
                Username:
                <input className="form__input" type="text" ref={ usernameRef } />
            </label>
            <label className="form__label">
                Email:
                <input className="form__input" type="email" ref={ emailRef } />
            </label>
            <label className="form__label">
                Password:
                <input className="form__input" type="password" ref={ passwordRef } />
            </label>
            <label className="form__label">
                Confirm Password:
                <input className="form__input" type="password" ref={ passwordRepeatRef } />
            </label>
            
            <button className="form__button" onClick={ registerUser }>Register</button>
            <p className="form__text">Already a member? <span onClick={ () => toggleForm('LOGIN') } className="form__link">Click here</span> to login.</p>
        </form>
    )
}

export default RegisterForm;