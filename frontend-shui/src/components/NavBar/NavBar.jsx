import React from 'react'
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import './navBar.css';
import { useAuthStore } from '../../stores/useAuthStore';

const NavBar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            {!user && (
                <Button text="Login" onClick={() => navigate('/auth')} />
            )}

            {user?.role === 'ADMIN' && (
                <Button text="Logout" onClick={logout} />
            )}

            {
                user?.role === 'GUEST' && (
                    <>
                        <Button text="Search" onClick={() => navigate('/booking')} />
                        <Button text="My bookings" onClick={() => navigate('/bookings')} />
                        <Button text="Logout" onClick={logout} />
                    </>
                )
            }
        </nav>
    )
}

export default NavBar;