import logo from '../../assets/logo.png';
import './logo.css';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/auth" className="logo">
            <img src={ logo } alt="logotype" className="logo__img" />
        </Link>
    )
}

export default Logo;