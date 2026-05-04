import React from 'react';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  return (
    <div className="subscription-page">
      <header className="sub-header">
        <div className="brand-logo">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt1xew4BMYH0tbzeYhwSNQOOH74J95f_ea0WD-lgrL6D6FFNZ27iqVR29Zck8NQFbdMEb3fEdCvX9sCi0cMi__lRxeteY_fLKO5JmcMzZvbXUuSmhLUJs7YdOXN7raCY13Yf4vEPN5Ew4VA-D1daaBTSd6XdcPJrJFWyjJ27xNEVuiHBERKWBfHiDsZnk5xlEUZtLJOBPStpub7t9wAPJdmxvDkDSPBzXTJJ7I7l215_x8hVu2mSiyEjCsU_R5095gfPj75i_DCO3d" alt="Netflix" />
        </div>
        <h1 className="sub-title">Netflix</h1>
        <div className="status-container">
          <span className="status-badge">
            <span className="dot"></span> Active
          </span>
        </div>
      </header>

      <div className="sub-grid">
        <div className="main-col">
          <div className="details-card">
            <h2>Subscription Details</h2>
            <div className="details-row">
              <div className="detail-item">
                <p className="label">Current Plan</p>
                <p className="value">Premium Ultra HD</p>
                <p className="sub-value">4K + HDR, 4 simultaneous screens</p>
              </div>
              <div className="detail-item">
                <p className="label">Next Billing Date</p>
                <div className="date-box">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <p className="value">Oct 15, 2023</p>
                </div>
              </div>
            </div>
          </div>

          <div className="spending-trend-card">
            <div className="card-header">
              <h2>Spending Trend</h2>
              <span className="trend-label">Stable Pricing</span>
            </div>
            <div className="chart-sim">
              <div className="bar-container"><div className="bar" style={{ height: '45%' }}></div><span>Jun</span></div>
              <div className="bar-container"><div className="bar" style={{ height: '60%' }}></div><span>Jul</span></div>
              <div className="bar-container"><div className="bar" style={{ height: '55%' }}></div><span>Aug</span></div>
              <div className="bar-container"><div className="bar active" style={{ height: '85%' }}></div><span className="active">Sep</span></div>
              <div className="bar-container"><div className="bar ghost" style={{ height: '40%' }}></div><span>Oct</span></div>
            </div>

          </div>
        </div>

        <div className="side-col">
          <div className="cost-card">
            <p className="label">Monthly Cost</p>
            <div className="price-box">
              <span className="price">$19.99</span>
              <span className="period">/mo</span>
            </div>
            <div className="cost-footer">
              <p>Total Paid (2023)</p>
              <p className="total">$179.91</p>
            </div>
          </div>

          <div className="actions-card">
            <h3>Quick Actions</h3>
            <button className="btn-cancel">
              <span className="material-symbols-outlined">cancel</span>
              Cancel via Subwise
            </button>
            <button className="btn-outline">
              <span className="material-symbols-outlined">upgrade</span>
              Change Plan
            </button>
            <p className="secure-text">Secured and verified by Subwise protection.</p>
          </div>

          <div className="alert-card">
            <div className="alert-icon">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div className="alert-content">
              <p className="alert-title">Billing Alert</p>
              <p className="alert-desc">Your price has been stable for the last 12 months. No upcoming increases detected.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-container">
          <div className="tx-list">
            {[
              { date: 'Sept 15, 2023', amount: '-$19.99' },
              { date: 'Aug 15, 2023', amount: '-$19.99' },
              { date: 'Jul 15, 2023', amount: '-$19.99' }
            ].map((tx, i) => (
              <div key={i} className="tx-row">
                <div className="tx-main">
                  <div className="tx-icon"><span className="material-symbols-outlined">receipt_long</span></div>
                  <div className="tx-info">
                    <p className="tx-name">Subscription Payment</p>
                    <p className="tx-date">{tx.date} • Visa ****4242</p>
                  </div>
                </div>
                <div className="tx-amount">
                  <p className="amount">{tx.amount}</p>
                  <p className="status">Completed</p>
                </div>
              </div>
            ))}
          </div>
          <div className="tx-footer">
            <button className="view-all-btn">View All History</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;
