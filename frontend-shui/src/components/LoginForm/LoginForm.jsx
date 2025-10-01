import { useState, useRef } from 'react';
import './loginForm.css';
import { apiLogin } from '../../api/auth';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';

const LoginForm = ({ toggleForm }) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Ny state för lösenordsvisning

    const usernameRef = useRef();
    const passwordRef = useRef();
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const {token, setToken} = useAuthToken();

    // Funktion för att toggle lösenordsvisning
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setError('');
        // Validering
        if (!usernameRef.current.value || !passwordRef.current.value) {
            setError('Username and password are required');
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await apiLogin({
                username : usernameRef.current.value,
                password : passwordRef.current.value
            });
            
            if (result.data?.token) {
                login({
                    username : usernameRef.current.value,
                    token : result.data.token
                });
                setToken(result.data.token);
                navigate('/notes');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className="form" onSubmit={loginUser}>
            <h1 className="form__title">Login</h1>
            {error && <div className="form__error">{error}</div>}
            <label className="form__label">
                Username:
                <input className="form__input" type="text" ref={usernameRef} required />
            </label>
            <label className="form__label">
                Password:
                <div className="password-input-container">
                    <input 
                        className="form__input" 
                        type={showPassword ? "text" : "password"} 
                        ref={passwordRef} 
                        required 
                    />
                    <i 
                        className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`}
                        onClick={togglePasswordVisibility}
                    ></i>
                </div>
            </label>
            <button type="submit" disabled={isLoading} className="form__button">
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p className="form__text">No account? <span onClick={ () => toggleForm('REGISTER') } className="form__link">Sign up</span> to register.</p>
        </form>
    )
}

export default LoginForm;