import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useSubscriptions } from '../../lib/SubscriptionContext';
import { supabase } from '../../lib/supabase';
import SetupWizard from '../../components/SetupWizard/SetupWizard';
import EditSubscriptionModal from '../../components/EditSubscriptionModal/EditSubscriptionModal';
import { generateInsights, getInsightForSubscription, fetchMarketPrices } from '../../lib/recommendations';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { subscriptions, loading } = useSubscriptions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [loadingMarket, setLoadingMarket] = useState(true);

  useEffect(() => {
    if (!loading && subscriptions.length === 0 && user) {
      setShowWizard(true);
    } else {
      setShowWizard(false);
    }
  }, [loading, subscriptions.length, user]);

  useEffect(() => {
    const loadMarketData = async () => {
      const data = await fetchMarketPrices();
      setMarketData(data);
      setLoadingMarket(false);
    };
    loadMarketData();
  }, []);

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const totalSpend = subscriptions.reduce((total, sub) => {
    const monthlyPrice = sub.billingCycle === 'Yearly' ? sub.price / 12 : sub.price;
    return total + monthlyPrice;
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'TV & Streaming': return { icon: 'movie', color: 'red' };
      case 'Music': return { icon: 'headphones', color: 'blue' };
      case 'Gaming': return { icon: 'sports_esports', color: 'purple' };
      case 'Software & AI': return { icon: 'smart_toy', color: 'green' };
      case 'Utilities': return { icon: 'bolt', color: 'orange' };
      default: return { icon: 'category', color: 'black' };
    }
  };

  const getSubLinks = (name) => {
    const overrides = {
      'youtube premium': { domain: 'youtube.com', manage: 'youtube.com/paid_memberships' },
      'amazon prime': { domain: 'amazon.com', manage: 'amazon.com/mc' },
      'disney+': { domain: 'disneyplus.com', manage: 'disneyplus.com/account' },
      'chatgpt plus': { domain: 'openai.com', manage: 'chatgpt.com/#settings/Subscription' },
      'xbox game pass': { domain: 'xbox.com', manage: 'account.microsoft.com/services' },
      'playstation plus': { domain: 'playstation.com', manage: 'store.playstation.com/subscriptions' },
      'apple music': { domain: 'apple.com', manage: 'music.apple.com/account' },
      'netflix': { domain: 'netflix.com', manage: 'netflix.com/YourAccount' },
      'spotify': { domain: 'spotify.com', manage: 'spotify.com/account/overview' },
      'hulu': { domain: 'hulu.com', manage: 'hulu.com/account' },
      'max': { domain: 'max.com', manage: 'auth.max.com/subscription' },
      'claude pro': { domain: 'anthropic.com', manage: 'claude.ai/settings/billing' },
      'gemini advanced': { domain: 'google.com', manage: 'myaccount.google.com/subscriptions' },
      'walmart+': { domain: 'walmart.com', manage: 'walmart.com/plus' },
      'amazon music': { domain: 'amazon.com', manage: 'amazon.com/music/settings' }
    };
    const key = name.toLowerCase().trim();
    if (overrides[key]) return overrides[key];
    
    // For unknown user subscriptions (e.g. Local Gym), we return a domain purely to attempt 
    // fetching a favicon, but we set manage to null so we don't display a fake broken link.
    const fallbackDomain = key.replace(/\s+/g, '') + '.com';
    return { domain: fallbackDomain, manage: null };
  };

  const getLogoUrl = (name) => {
    return `https://www.google.com/s2/favicons?domain=${getSubLinks(name).domain}&sz=128`;
  };

  const insights = generateInsights(subscriptions, marketData);

  // Group by category for Breakdown
  const categoryTotals = {};
  subscriptions.forEach(sub => {
    const marketInfo = marketData?.[sub.name.toLowerCase().trim()];
    const displayCategory = marketInfo?.category || sub.category;

    const monthlyPrice = sub.billingCycle === 'Yearly' ? sub.price / 12 : sub.price;
    if (!categoryTotals[displayCategory]) {
      categoryTotals[displayCategory] = { amount: 0, names: [] };
    }
    categoryTotals[displayCategory].amount += monthlyPrice;
    categoryTotals[displayCategory].names.push(sub.name);
  });

  const categories = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    amount: categoryTotals[cat].amount,
    subs: categoryTotals[cat].names,
    percentage: totalSpend > 0 ? ((categoryTotals[cat].amount / totalSpend) * 100).toFixed(0) : 0
  })).sort((a, b) => b.amount - a.amount);


  if (loading || loadingMarket) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '16px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-primary)', animation: 'spin 2s linear infinite' }}>sync</span>
        <p>Syncing live market data...</p>
      </div>
    );
  }



  const totalSavings = insights.reduce((acc, curr) => acc + (curr.savings || 0), 0);
  const optimizedSpend = Math.max(0, totalSpend - totalSavings);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 style={{ fontSize: 'var(--font-heading-xl-size)', marginBottom: 'var(--spacing-lg)' }}>
          Welcome back, {userName}! 👋
        </h1>
        <div className="header-top">
          <p className="label">Total Monthly Spend</p>
          <div className="spend-info">
            <h1 className="spend-amount">{formatCurrency(totalSpend)}</h1>
          </div>
        </div>

        {totalSavings > 0 && totalSpend > 0 && (
          <div className="savings-projection">
            <div className="projection-labels">
              <span className="opt-label">Optimized: {formatCurrency(optimizedSpend)}/mo</span>
              <span className="sav-label">Potential Savings: {formatCurrency(totalSavings)}/mo</span>
            </div>
            <div className="projection-bar">
              <div className="bar-optimized" style={{ width: `${(optimizedSpend / totalSpend) * 100}%` }}></div>
              <div className="bar-savings" style={{ width: `${(totalSavings / totalSpend) * 100}%` }}></div>
            </div>
          </div>
        )}
      </header>

      {subscriptions.length === 0 && !showWizard ? (
        <section className="dashboard-empty-state" style={{ textAlign: 'center', padding: 'var(--spacing-3xl) var(--spacing-lg)' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-outline)' }}>subscriptions</span>
          </div>
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>No subscriptions yet</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-xl)', maxWidth: '400px', margin: '0 auto var(--spacing-xl)' }}>
            Start tracking your recurring expenses by adding your first subscription. We'll help you stay on top of your bills!
          </p>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', marginRight: '8px' }}>add</span>
            Add Subscription
          </button>
        </section>
      ) : null}

      {subscriptions.length > 0 ? (
        <>
          <div className="dashboard-grid">
            {/* Main Content: Subscriptions */}
          <div className="main-col">
            <section className="dashboard-section">
              <div className="section-title-bar">
                <h2>Your Subscriptions</h2>
                <button className="text-btn" onClick={() => setIsAddModalOpen(true)}>+ Add New</button>
              </div>
              <div className="subscriptions-grid">
                {[...subscriptions].sort((a, b) => {
                  const dateA = new Date(a.nextBillingDate || 0).getTime();
                  const dateB = new Date(b.nextBillingDate || 0).getTime();
                  return dateA - dateB;
                }).map((sub) => {
                  const marketInfo = marketData?.[sub.name.toLowerCase().trim()];
                  const displayCategory = marketInfo?.category || sub.category;
                  const styleInfo = getCategoryIcon(displayCategory);
                  const cardInsight = getInsightForSubscription(sub, subscriptions, marketData);
                  
                  return (
                    <div className="renewal-card" key={sub.id}>
                      <div className="card-top">
                        <div className={`icon-box ${styleInfo.color}`} style={{ overflow: 'hidden', padding: 0 }}>
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
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                            onClick={() => setEditingSub(sub)}
                            title="Edit Subscription"
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-on-surface)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <span className="due-label">{sub.billingCycle}</span>
                        </div>
                      </div>
                      <div className="card-info" style={{ position: 'relative' }}>
                        {getSubLinks(sub.name).manage && (
                          <a 
                            href={`https://${getSubLinks(sub.name).manage}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="sub-link-icon" 
                            title={`Manage ${sub.name}`}
                          >
                            <span className="material-symbols-outlined">open_in_new</span>
                          </a>
                        )}
                        <h3>{sub.name}</h3>
                        <p className="card-category-label">Category: {displayCategory}</p>
                        <p className="due-date">Next bill: {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'soon'}</p>
                        <p className="price">{formatCurrency(sub.price)}<span>/{sub.billingCycle === 'Yearly' ? 'yr' : 'mo'}</span></p>
                      </div>
                      <div className={`card-insight type-${cardInsight.type}`}>
                        <span className="material-symbols-outlined">
                          {cardInsight.type === 'good' ? 'check_circle' : 
                           (cardInsight.type === 'warning' || cardInsight.type === 'alert' ? 'warning' : 'lightbulb')}
                        </span>
                        <p>
                          {cardInsight.text.includes('Opinion:') 
                            ? cardInsight.text.split('Opinion:')[1]?.split('Recommendation:')[0].trim() 
                            : cardInsight.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Sidebar: Insights & Breakdown */}
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
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-xxl)' }}>
          <section className="category-card" style={{ width: 'fit-content', minWidth: '350px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Category Detail</h3>
            <div className="cat-list">
              {categories.map(cat => {
                const styleInfo = getCategoryIcon(cat.name);
                return (
                  <div className="cat-item" key={cat.name}>
                    <div className="cat-main">
                      <div className={`cat-icon ${styleInfo.color}`}><span className="material-symbols-outlined">{styleInfo.icon}</span></div>
                      <div><p className="name">{cat.name}</p><p className="subs">{cat.subs.join(', ')}</p></div>
                    </div>
                    <span className="price">{formatCurrency(cat.amount)}/mo</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </>
      ) : null}

      {isAddModalOpen && (
        <SetupWizard 
          isAddMode={true} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}

      {editingSub && (
        <EditSubscriptionModal
          sub={editingSub}
          onClose={() => setEditingSub(null)}
        />
      )}

      {showWizard && (
        <SetupWizard onComplete={async () => {
          if (user) {
            await supabase.auth.updateUser({
              data: { setup_completed: true }
            });
          }
          setShowWizard(false);
        }} />
      )}
    </div>
  );
};

export default DashboardPage;
