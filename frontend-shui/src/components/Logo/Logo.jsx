import logo from '../../assets/logo-1.png';
import './logo.css';
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="logo">
            <img src={ logo } alt="logotype" className="logo__img" />
        </Link>
    )
}

export default Logo;