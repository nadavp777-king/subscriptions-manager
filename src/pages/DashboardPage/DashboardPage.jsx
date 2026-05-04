import React from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-top">
          <p className="label">Total Monthly Spend</p>
          <div className="spend-info">
            <h1 className="spend-amount">$145.50</h1>
            <span className="trend down">
              <span className="material-symbols-outlined">trending_down</span> 4.2%
            </span>
          </div>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-title-bar">
          <h2>Upcoming Renewals</h2>
          <button className="text-btn">View Calendar</button>
        </div>
        <div className="renewal-cards">
          <div className="renewal-card">
            <div className="card-top">
              <div className="icon-box red">
                <span className="material-symbols-outlined">movie</span>
              </div>
              <span className="due-label">In 2 days</span>
            </div>
            <div className="card-info">
              <h3>Netflix</h3>
              <p className="due-date">Due May 24, 2024</p>
              <p className="price">$15.99<span>/mo</span></p>
            </div>
          </div>
          <div className="renewal-card">
            <div className="card-top">
              <div className="icon-box green">
                <span className="material-symbols-outlined">music_note</span>
              </div>
              <span className="due-label">In 5 days</span>
            </div>
            <div className="card-info">
              <h3>Spotify</h3>
              <p className="due-date">Due May 27, 2024</p>
              <p className="price">$10.99<span>/mo</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-title-bar">
          <h2>Active Subscriptions</h2>
          <div className="action-btns">
            <button className="icon-btn"><span className="material-symbols-outlined">filter_list</span></button>
            <button className="icon-btn"><span className="material-symbols-outlined">sort</span></button>
          </div>
        </div>
        <div className="subs-list">
          <div className="sub-item">
            <div className="sub-main">
              <div className="sub-icon blue"><span className="material-symbols-outlined">cloud</span></div>
              <div className="sub-text">
                <p className="sub-name">iCloud+</p>
                <p className="sub-cat">Cloud Storage</p>
              </div>
            </div>
            <div className="sub-price">
              <p className="amount">$9.99</p>
              <p className="period">Monthly</p>
            </div>
          </div>
          <div className="sub-item">
            <div className="sub-main">
              <div className="sub-icon black"><span className="material-symbols-outlined">code</span></div>
              <div className="sub-text">
                <p className="sub-name">GitHub Copilot</p>
                <p className="sub-cat">Development</p>
              </div>
            </div>
            <div className="sub-price">
              <p className="amount">$10.00</p>
              <p className="period">Monthly</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
