import React from 'react';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      <header className="page-header">
        <h1>Spending Insights</h1>
        <p>A visual breakdown of your monthly commitments</p>
      </header>

      <div className="analytics-grid">
        <section className="chart-section">
          <div className="section-header">
            <h3>Monthly Distribution</h3>
            <span className="material-symbols-outlined">info</span>
          </div>
          <div className="donut-container">
            <div className="donut-chart"></div>
            <div className="donut-hole">
              <span className="label">Total Spent</span>
              <span className="amount">$2,450</span>
              <span className="stat">+4.2% vs last mo.</span>
            </div>
          </div>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="dot blue"></div>
              <span>Streaming</span>
              <p>40%</p>
            </div>
            <div className="legend-item">
              <div className="dot grey"></div>
              <span>Gym</span>
              <p>25%</p>
            </div>
            <div className="legend-item">
              <div className="dot light-grey"></div>
              <span>Software</span>
              <p>20%</p>
            </div>
            <div className="legend-item">
              <div className="dot lighter-grey"></div>
              <span>Others</span>
              <p>15%</p>
            </div>
          </div>
        </section>

        <div className="sidebar-col">
          <section className="alerts-card">
            <div className="card-header">
              <span className="material-symbols-outlined">lightbulb</span>
              <h3>Smart Alerts</h3>
            </div>
            <div className="alert-item">
              <span className="material-symbols-outlined">warning</span>
              <div>
                <p className="alert-title">Price Increase Detected</p>
                <p className="alert-desc">Netflix monthly plan is increasing by $2.00 next cycle.</p>
              </div>
            </div>
            <div className="alert-item">
              <span className="material-symbols-outlined">savings</span>
              <div>
                <p className="alert-title">Potential Savings</p>
                <p className="alert-desc">You have 3 music services. Consider consolidating to save $24/mo.</p>
              </div>
            </div>
          </section>

          <section className="category-card">
            <h3>Category Detail</h3>
            <div className="cat-list">
              <div className="cat-item">
                <div className="cat-main">
                  <div className="cat-icon"><span className="material-symbols-outlined">movie</span></div>
                  <div><p className="name">Streaming</p><p className="subs">Netflix, HBO, Disney+</p></div>
                </div>
                <span className="price">$980.00</span>
              </div>
              <div className="cat-item">
                <div className="cat-main">
                  <div className="cat-icon"><span className="material-symbols-outlined">fitness_center</span></div>
                  <div><p className="name">Gym</p><p className="subs">Equinox, Peloton</p></div>
                </div>
                <span className="price">$612.50</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
