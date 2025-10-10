import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import './homePage.css';




const HomePage = () => {
    const navigate = useNavigate();
    return (
        <Link to="/auth" className="home-page">
            <div className="bizzy">
                <p className="bizzy-letters letter-s">S</p>
                <p className="bizzy-letters letter-h">H</p>
                <p className="bizzy-letters letter-u">U</p>
                <p className="bizzy-letters letter-i">I</p>
            </div>
            <div className="bizzy-letters-B">
                <p className="bizzy-letters-B letter-N">N</p>
                <p className="bizzy-letters-B letter-O">O</p>
                <p className="bizzy-letters-B letter-T">T</p>
                <p className="bizzy-letters-B letter-E">E</p>
            </div>
        </Link>
    );
}

export default HomePage;