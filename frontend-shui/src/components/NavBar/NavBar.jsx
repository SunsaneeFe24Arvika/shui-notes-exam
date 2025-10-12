import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './navBar.css';
import { useAuthStore } from '../../stores/useAuthStore';
import menuIcon from '../../assets/burger-menu.png';
import pencilIcon from '../../assets/pencil.svg';
import logoutIcon from '../../assets/log-out.png';
import backIcon from '../../assets/left.png';


const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const { token } = useAuthStore();
    const navigate = useNavigate();

    const handlerBackClick = () => {
            if (window.history.length > 2) {
                navigate(-1)
            } else if (location.pathname.startsWith('/notes/')) { 
                navigate('/notes');
            }
        }

    const handlerNewPost = () => {
        navigate('/create-note'); 
    };
    

    const handlerLogout = () => {
        logout();
        navigate('/');
    };

    
    return (
        <>
        {isOpen && <div className="fab-overlay" onClick={() => setIsOpen(false)} />}
        <div className="floating-action-menu">
            <div className="fab-main">
                <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fab-toggle-custom"
                data-tooltip="Menu"
            >
                <img src={menuIcon} alt="Menu" className='fab-icon' />
            </button>
            </div>
            
            {isOpen && (
                <div className="fab-actions">
                    <button 
                    onClick={handlerBackClick}
                    className="fab-button-custom secondary"
                    data-tooltip="Go back"
                    >
                        <img src={backIcon} alt="Back" className='fab-icon' />
                    </button>
                    <button 
                    onClick={handlerNewPost}
                    className="fab-button-custom secondary"
                    data-tooltip="New Post"
                    >
                        <img src={pencilIcon} alt="New Post" className='fab-icon' />
                    </button>
                    <button 
                        onClick={handlerLogout}
                        className="fab-button-custom secondary"
                        data-tooltip="Exist"
                    >
                        <img src={logoutIcon} alt="Log out" className='fab-icon' />
                    </button>
                </div>
            )}
        </div>
    </>
)

}

export default NavBar;