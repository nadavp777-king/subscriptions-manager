import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/login');
  };

  const avatarUrl = user?.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

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
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Dashboard</NavLink>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>

              <div className="user-profile-container" style={{ position: 'relative' }}>
                <button 
                  className="user-profile-btn" 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '24px' }}
                >
                  <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-on-surface)' }}>{userName}</span>
                  <div className="user-profile-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0, 84, 214, 0.1)' }}>
                    <img 
                      src={avatarUrl} 
                      alt={userName} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-on-surface-variant)' }}>
                    expand_more
                  </span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{userName}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <span className="material-symbols-outlined">logout</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }} onClick={closeMenu}>Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }} onClick={closeMenu}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
