import { useState } from 'react'
import './authPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from '../../components/Logo/Logo';

const FORM_TYPE = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER'
};

const AuthPage = () => {
    const [ activeForm, setActiveForm ] = useState(FORM_TYPE.LOGIN);

    const toggleForm = (form) => {
        setActiveForm(form);
    }

    return (
        <section className="auth-page page">
            <Logo />
            {
                activeForm === FORM_TYPE.LOGIN
                ? <LoginForm toggleForm={ toggleForm } />
                : <RegisterForm toggleForm={ toggleForm } /> 
            }
        </section>
    )
}

export default AuthPage;