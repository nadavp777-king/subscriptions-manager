import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Take command of your <span className="highlight">recurring world.</span>
        </h1>
        <p className="hero-subtitle">
          The ultimate fintech companion to track, optimize, and master every subscription in your financial ecosystem.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Explore Demo</button>
        </div>
        <div className="trust-indicator">
          <div className="avatar-group">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4nWMm71S5tJ17iEYqWuIhu34_AviJYAhrZ64ugR99LEkjGKrhmgx16uTHYwPFJRVer-5dxgY1PaYkDZPWYkjn2LFvfnUmKOKJHc5-LIelvD-x-jUHYYFcK44T_lMvak9W90ah6tWxrPTTgrMcM78zNTrIOVdc5Fy_eaGsiBDDgjqG86KEZZZNQtT4AvQIssHayR0MO5DRai9cMQKNEc8IkADGhdXdEETQebtzEo0Do9p8upiMVFfOn-FbLMJeR0PeMAymvCSILCNz" alt="User 1" />
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-IPinalTbnMjmcT4zwDYdtt9B9Xoq0CFRMnfz5h5HMwIwOqwBcE4TICRV7IdcJ0VpbVHTKTPQ7DQV4B9WZwolyq_466Qy_NzzKqlMRXwkMaugGQZMkM2F0Y9DDqvQcjjERpPk4EAbfbSCmCWDkyCtDcAonrHeX8_2Sx9WimRkKd6ndLW5pjWCSNeRGotXorSeCB4NMuS0DaaJYEUgG2QfFcok3SWOo_UGjRlY-eGfGxtDnisZJcp9jx-KLsVm2uQR7kOtXGUtdzI2" alt="User 2" />
            <div className="avatar-more">+10k</div>
          </div>
          <p className="trust-text">Trusted by thousands of smart savers</p>
        </div>
      </div>
      <div className="hero-visual">
        <div className="visual-container">
          <div className="visual-background"></div>
          <div className="floating-card spend-card">
            <div className="card-header">
              <span className="card-label">Monthly Spend</span>
              <div className="card-amount">$284.50</div>
            </div>
            <div className="card-trend">
              <span className="material-symbols-outlined">trending_up</span>
              <span>12%</span>
            </div>
          </div>
          <img 
            className="main-visual-img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzq-h8AF1y1iTyxGDRUlep9loX20wB0tgIvK_IfmieO-7k9Zy3NWu80FJDG40MXDWDF9p7XOiSla1vTn_X3svGtREaNf3Y97SoYvB7iRcVc3P863usd4ceWcK-zN4KKm4Ui7wV6Ula_lyzrOjJlzHD-Y1DJFyUDiB6aO_keGJ-YWin2JvhJmoN7SaraBBI7VtltKEjfqumuBCFPBlTTi4VnIQBrL1b51VYhA15dBli1DOdk4zkU-4drLX9KnP3w8FU8bFSV-SUnsxT" 
            alt="Dashboard" 
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
