import React from 'react'
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import './navBar.css';
import { useAuthStore } from '../../stores/useAuthStore';

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            {!user ? (
                // Visa när användaren INTE är inloggad
                <div className="nav-guest">
                    <Button text="Login" onClick={() => navigate('/auth')} />
                </div>
            ) : (
                // Visa när användaren ÄR inloggad
                <div className="nav-authenticated">
                    <div className="nav-left">
                        <span className="welcome-text">Välkommen, {user.username || user.name}!</span>
                    </div>
                    <div className="nav-menu">
                        <Button text="Home" onClick={() => navigate('/')} />
                        <Button text="New Post" onClick={() => navigate('/create-note')} />
                        <Button text="Profile" onClick={() => navigate('/profile')} />
                    </div>
                    <div className="nav-right">
                        <Button text="Logout" onClick={handleLogout} />
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar;