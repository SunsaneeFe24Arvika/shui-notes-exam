import { Link } from 'react-router-dom';
import logo from '../../assets/shui-logo.png';
import './header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Shui Notes Logo" className="header__logo" />
      </Link>
      
    </header>
  );
}

export default Header;