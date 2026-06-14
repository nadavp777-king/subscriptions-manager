import React from 'react';
import { useSubscriptions } from '../../lib/SubscriptionContext';
import { generateInsights } from '../../lib/recommendations';
import { Link } from 'react-router-dom';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const { subscriptions } = useSubscriptions();
  const insights = generateInsights(subscriptions);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalSpend = subscriptions.reduce((total, sub) => {
    const monthlyPrice = sub.billingCycle === 'Yearly' ? sub.price / 12 : sub.price;
    return total + monthlyPrice;
  }, 0);

  // Group by category
  const categoryTotals = {};
  subscriptions.forEach(sub => {
    const monthlyPrice = sub.billingCycle === 'Yearly' ? sub.price / 12 : sub.price;
    if (!categoryTotals[sub.category]) {
      categoryTotals[sub.category] = { amount: 0, names: [] };
    }
    categoryTotals[sub.category].amount += monthlyPrice;
    categoryTotals[sub.category].names.push(sub.name);
  });

  const categories = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    amount: categoryTotals[cat].amount,
    subs: categoryTotals[cat].names,
    percentage: totalSpend > 0 ? ((categoryTotals[cat].amount / totalSpend) * 100).toFixed(0) : 0
  })).sort((a, b) => b.amount - a.amount);

  const donutColors = [
    'var(--color-primary-container)',
    'var(--color-tertiary)',
    'var(--color-outline)',
    'var(--color-error)',
    'var(--color-primary-fixed-dim)'
  ];

  let cumulativePercent = 0;
  const gradientStops = categories.map((cat, index) => {
    const start = cumulativePercent;
    cumulativePercent += parseFloat(cat.percentage);
    const color = donutColors[index % donutColors.length];
    return `${color} ${start}% ${cumulativePercent}%`;
  }).join(', ');
  
  const conicGradient = categories.length > 0 ? `conic-gradient(${gradientStops})` : 'conic-gradient(var(--color-surface-container-high) 0% 100%)';

  // Quick helper to determine an icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Entertainment': return 'movie';
      case 'Productivity': return 'work';
      case 'Utilities': return 'bolt';
      case 'Health': return 'fitness_center';
      default: return 'category';
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="analytics-page">
        <header className="page-header">
          <h1>Spending Insights</h1>
          <p>A visual breakdown of your monthly commitments</p>
        </header>
        <section className="dashboard-empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-3xl) var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)' }}>analytics</span>
          </div>
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>No data to analyze</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xl)', maxWidth: '400px', margin: '0 auto var(--spacing-xl)' }}>
            Add some subscriptions from your dashboard to see insights and breakdown of your spending.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Go to Dashboard
          </Link>
        </section>
      </div>
    );
  }

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
            <div className="donut-chart" style={{ background: conicGradient }}></div>
            <div className="donut-hole">
              <span className="label">Total Spent</span>
              <span className="amount">{formatCurrency(totalSpend)}</span>
              <span className="stat">Active</span>
            </div>
          </div>
          <div className="legend-grid">
            {categories.map((cat, index) => (
              <div className="legend-item" key={cat.name}>
                <div className="dot" style={{ backgroundColor: donutColors[index % donutColors.length] }}></div>
                <span>{cat.name}</span>
                <p>{cat.percentage}%</p>
              </div>
            ))}
          </div>
        </section>

        <div className="sidebar-col">
          <section className="alerts-card">
            <div className="card-header">
              <span className="material-symbols-outlined">lightbulb</span>
              <h3>Market Insights</h3>
            </div>
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div className={`alert-item severity-${insight.severity}`} key={idx}>
                  <span className="material-symbols-outlined" style={{ color: insight.color }}>{insight.icon}</span>
                  <div>
                    <p className="alert-title">{insight.title}</p>
                    <p className="alert-desc">{insight.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert-item">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
                <div>
                  <p className="alert-title">Optimized!</p>
                  <p className="alert-desc">Your subscriptions look great compared to current market prices.</p>
                </div>
              </div>
            )}
          </section>

          <section className="category-card">
            <h3>Category Detail</h3>
            <div className="cat-list">
              {categories.map(cat => (
                <div className="cat-item" key={cat.name}>
                  <div className="cat-main">
                    <div className="cat-icon"><span className="material-symbols-outlined">{getCategoryIcon(cat.name)}</span></div>
                    <div><p className="name">{cat.name}</p><p className="subs">{cat.subs.join(', ')}</p></div>
                  </div>
                  <span className="price">{formatCurrency(cat.amount)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
