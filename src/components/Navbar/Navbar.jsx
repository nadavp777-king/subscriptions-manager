import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <span className="logo-text">Subwise</span>
        </NavLink>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className="material-symbols-outlined">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Analytics</NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Subscriptions</NavLink>
        </div>

        <div className="navbar-actions">
          <button className="nav-icon-btn">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <NavLink to="/subscriptions" className="user-profile" onClick={closeMenu}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhfl3C1z1iLti01uxpbpiJKHDqutpcDY8X19aS7a6LwOlYzHD0mnl3fIEwp5Ii2jCu0xN8HfR6U59DWhyf8Hujn83JDdP5aTq66VfR1how3Y-cpA_2UOLCh7mcbJIRTRYNUVu3gbTXskikuorj6LLlvgl6ijTV0ioHm-MqwLzb1Wg6ZZfEkK3lbjXT9vf79cdEhbQi9z_AIgnuYJgHyYd10iHUcxF4BJXI-MVOgAGWEkioA0pYoan2fcf8NRztlNDc5p9zSPKAufLa" 
              alt="User" 
            />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
