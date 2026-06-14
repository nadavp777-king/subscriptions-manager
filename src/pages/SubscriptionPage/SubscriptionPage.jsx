import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSubscriptions } from '../../lib/SubscriptionContext';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const { id } = useParams();
  const { subscriptions, removeSubscription } = useSubscriptions();
  const navigate = useNavigate();

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Quick helper to determine an icon and color
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Entertainment': return { icon: 'movie', color: 'red' };
      case 'Productivity': return { icon: 'work', color: 'blue' };
      case 'Utilities': return { icon: 'bolt', color: 'green' };
      case 'Health': return { icon: 'fitness_center', color: 'orange' };
      default: return { icon: 'category', color: 'black' };
    }
  };

  const getLogoUrl = (name) => {
    const overrides = {
      'youtube premium': 'youtube.com',
      'amazon prime': 'amazon.com',
      'disney+': 'disneyplus.com',
      'chatgpt plus': 'openai.com',
      'xbox game pass': 'xbox.com',
      'playstation plus': 'playstation.com',
      'apple music': 'apple.com'
    };
    const key = name.toLowerCase().trim();
    const domain = overrides[key] || (key.replace(/\s+/g, '') + '.com');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  if (subscriptions.length === 0) {
    return (
      <div className="subscription-page">
        <section className="dashboard-empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-3xl) var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)' }}>receipt_long</span>
          </div>
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>No active subscriptions</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xl)', maxWidth: '400px', margin: '0 auto var(--spacing-xl)' }}>
            Go to the dashboard to add your first subscription and start managing your expenses.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Go to Dashboard
          </Link>
        </section>
      </div>
    );
  }

  // If no ID is provided, just show a full list
  if (!id) {
    return (
      <div className="subscription-page">
        <header className="page-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1>All Subscriptions</h1>
          <p>Manage all your recurring commitments</p>
        </header>

        <div className="subs-grid" style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          {subscriptions.map(sub => {
            const styleInfo = getCategoryIcon(sub.category);
            return (
              <div className="sub-item" style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-outline-variant)' }} key={sub.id}>
                <div className="sub-main" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div className={`sub-icon ${styleInfo.color}`} style={{ width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `var(--color-surface-container)`, overflow: 'hidden' }}>
                    <img 
                      src={getLogoUrl(sub.name)} 
                      alt={sub.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <span className="material-symbols-outlined" style={{ display: 'none' }}>{styleInfo.icon}</span>
                  </div>
                  <div className="sub-text">
                    <p className="sub-name" style={{ fontWeight: '600', fontSize: 'var(--font-body-lg-size)' }}>{sub.name}</p>
                    <p className="sub-cat" style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-sm-size)' }}>{sub.category} • Renews {new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="sub-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                  <div className="sub-price" style={{ textAlign: 'right' }}>
                    <p className="amount" style={{ fontWeight: 'bold', fontSize: 'var(--font-body-lg-size)' }}>{formatCurrency(sub.price)}</p>
                    <p className="period" style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-sm-size)' }}>{sub.billingCycle}</p>
                  </div>
                  <Link to={`/subscription/${sub.id}`} className="btn-secondary" style={{ textDecoration: 'none' }}>Details</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  // Detail View
  const sub = subscriptions.find(s => s.id === id);
  if (!sub) {
    return <div style={{ padding: '2rem' }}>Subscription not found. <Link to="/subscriptions">Go back</Link></div>;
  }

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to remove ${sub.name}?`)) {
      removeSubscription(sub.id);
      navigate('/subscriptions');
    }
  };

  return (
    <div className="subscription-page">
      <header className="sub-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <img 
          src={getLogoUrl(sub.name)} 
          alt={sub.name} 
          style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          <h1 className="sub-title" style={{ margin: 0 }}>{sub.name}</h1>
          <div className="status-container" style={{ marginTop: 'var(--spacing-xs)' }}>
            <span className="status-badge">
              <span className="dot"></span> Active
            </span>
          </div>
        </div>
      </header>

      <div className="sub-grid">
        <div className="main-col">
          <div className="details-card">
            <h2>Subscription Details</h2>
            <div className="details-row">
              <div className="detail-item">
                <p className="label">Category</p>
                <p className="value">{sub.category}</p>
              </div>
              <div className="detail-item">
                <p className="label">Next Billing Date</p>
                <div className="date-box">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <p className="value">{new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="side-col">
          <div className="cost-card">
            <p className="label">Cost</p>
            <div className="price-box">
              <span className="price">{formatCurrency(sub.price)}</span>
              <span className="period">/{sub.billingCycle === 'Yearly' ? 'yr' : 'mo'}</span>
            </div>
          </div>

          <div className="actions-card">
            <h3>Quick Actions</h3>
            <button className="btn-cancel" onClick={handleCancel}>
              <span className="material-symbols-outlined">cancel</span>
              Remove Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
