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
        console.log('🔍 Login attempt started');
        console.log('Username:', usernameRef.current.value);
        

        setError('');
        // Validering
        if (!usernameRef.current.value || !passwordRef.current.value) {
            setError('Username and password are required');
            return;
        }
        
        setIsLoading(true);
    try {
        console.log('🌐 Calling apiLogin...');
        const result = await apiLogin({
            username : usernameRef.current.value,
            password : passwordRef.current.value
        });
        
        console.log('📊 API result:', result);
        console.log('🎫 Token:', result.data?.token);
        
        if (result.data?.token) {
            console.log('✅ Login successful, calling store login...');
            login({
                username : usernameRef.current.value,
                token : result.data.token
            });
            setToken(result.data.token);
            console.log('🚀 Navigating to /notes');
            navigate('/notes');
        } else {
            console.log('❌ No token in response');
            setError('Login failed - no token received');
        }
    } catch (err) {
    console.error('💥 Login error:', err);
    // Mer specifik felhantering baserat på fel typ
    if (err.response?.status === 401) {
        setError('Invalid username or password');
    } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
    } else {
        setError('Login failed. Please check your credentials.');
    }
    } finally {
        setIsLoading(false);
    }
}

    return (
        <form className="form" onSubmit={loginUser}>
            <h1 className="form__title">Login</h1>
            {error && <div id="login-error" className="form__error" role="alert">{error}</div>}
                
            <label className="form__label">
                Username:
                <div className="username-input-container"> 
                    <input className="form__input" type="text" ref={usernameRef} required 
                    />
                    <i className="fa-solid fa-user"></i> 
                </div>
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
            <button type="submit" disabled={isLoading} className="login-form__btn">
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p className="form__text">No account? <span onClick={ () => toggleForm('REGISTER') } className="form__link">Sign up</span> to register.</p>
        </form>
    )
}

export default LoginForm;