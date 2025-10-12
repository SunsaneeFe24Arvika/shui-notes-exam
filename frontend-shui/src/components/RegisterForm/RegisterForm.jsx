import { useRef, useState } from 'react';
import './registerForm.css';
import { apiRegister } from '../../api/auth';

const RegisterForm = ({ toggleForm }) => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordRepeatRef = useRef();

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [error, setError] = useState('');

     // Funktion för att toggle lösenordsvisning
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const registerUser = async (e) => {
        e.preventDefault();
        
        // Validera att lösenorden matchar
        if (passwordRef.current.value !== passwordRepeatRef.current.value) {
            setError('Passwords do not match');
            return;
        }

        const result = await apiRegister({
            username : usernameRef.current.value,
            password : passwordRef.current.value,
            email : emailRef.current.value,
        });

        if(result.status === 201) {
            toggleForm('LOGIN');
        } else {
            setError(result.message || 'Registration failed');
            console.log(result);
        }
    }

    return (
        <form className="form">
            <h1 className="form__title">Register Account</h1>
            <label className="form-username">
                Username:
                <input className="form__input" type="text" ref={ usernameRef } />
            </label>
            <label className="form-email">
                Email:
                <input className="form__input" type="email" ref={ emailRef } />
            </label>
            <label className="form__label">
                Password:
                <div className='password-input-container'>
                    <input className="form__input" type="password" ref={ passwordRef } />
                <i 
                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
                    onClick={togglePasswordVisibility}
                ></i>
                </div>         
            </label>
            <label className="form__label">
                Confirm Password:
                <div className='password-input-container'>
                    <input className="form__input password-input-container" type="password" ref={ passwordRepeatRef } />
                <i 
                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
                    onClick={togglePasswordVisibility}
                ></i>
                </div>                
            </label>
            
            <button className="register__button" onClick={ registerUser }>Register</button>
            <p className="form__text">Already a member? <span onClick={ () => toggleForm('LOGIN') } className="form__link">Click here</span> to login.</p>
        </form>
    )
}

export default RegisterForm;