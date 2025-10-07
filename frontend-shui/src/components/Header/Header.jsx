import React from 'react'
import logo from '../../assets/shui-logo.png'; 
import './header.css';

function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Shui Notes Logo" className="header__logo" />
    </header>
  );
}

export default Header;