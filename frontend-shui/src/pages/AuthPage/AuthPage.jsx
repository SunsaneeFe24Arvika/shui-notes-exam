import { useState } from 'react'
import './authPage.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Logo from '../../components/Logo/Logo';
import bg from '../../assets/bg4.jpg';

const AuthPage = () => {
    const [ activeForm, setActiveForm ] = useState('LOGIN');

    const toggleForm = (form) => {
        setActiveForm(form);
    }

    return (
        <section className="auth-page page" style={{ backgroundImage: `url(${bg})`}}>
            <Logo />
            {
                activeForm === 'LOGIN'
                ? <LoginForm toggleForm={ toggleForm } />
                : <RegisterForm toggleForm={ toggleForm } />
            }
        </section>
    )
}

export default AuthPage;