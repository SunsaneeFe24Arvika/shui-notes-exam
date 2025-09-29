import { useState, useRef } from 'react';
import './loginForm.css';
import { loginApi } from '../../api/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';

const LoginForm = ({ toggleForm }) => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const {setToken} = useAuthToken();
    
    const loginUser = async (e) => {
        e.preventDefault();
        const result = await loginApi({
            username : usernameRef.current.value,
            password : passwordRef.current.value
        });
        console.log(result.data);
        login({
            username : usernameRef.current.value,
            role: result.data.role,
            token : result.data.token
        });
        setToken(result.data.token);
        if(result.data.role === "GUEST")
            navigate('/booking');
        else
            navigate('/admin');
    }

    return (
        <form className="form">
            <h1 className="form__title">Login</h1>
            <label className="form__label">
                Username:
                <input className="form__input" type="text" ref={usernameRef} />
            </label>
            <label className="form__label">
                Password:
                <input className="form__input" type="password" ref={passwordRef} />
            </label>
            <button onClick={ loginUser } className="form__button">Login</button>
            <p className="form__text">No account? <span onClick={ () => toggleForm('REGISTER') } className="form__link">Click here</span> to register.</p>
        </form>
    )
}

export default LoginForm;