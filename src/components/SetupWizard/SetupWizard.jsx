import React, { useState } from 'react';
import { useSubscriptions } from '../../lib/SubscriptionContext';
import { useAuth } from '../../lib/AuthContext';
import './SetupWizard.css';

const POPULAR_SUBSCRIPTIONS = [
  { id: 'netflix', name: 'Netflix', price: 15.49, billingCycle: 'Monthly', category: 'Entertainment', domain: 'netflix.com' },
  { id: 'spotify', name: 'Spotify', price: 10.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'spotify.com' },
  { id: 'amazon', name: 'Amazon Prime', price: 14.99, billingCycle: 'Monthly', category: 'Utilities', domain: 'amazon.com' },
  { id: 'youtube', name: 'YouTube Premium', price: 13.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'youtube.com' },
  { id: 'apple', name: 'Apple Music', price: 10.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'apple.com' },
  { id: 'disney', name: 'Disney+', price: 7.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'disneyplus.com' },
  { id: 'chatgpt', name: 'ChatGPT Plus', price: 20.00, billingCycle: 'Monthly', category: 'Productivity', domain: 'openai.com' },
  { id: 'playstation', name: 'PlayStation Plus', price: 9.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'playstation.com' },
  { id: 'xbox', name: 'Xbox Game Pass', price: 9.99, billingCycle: 'Monthly', category: 'Entertainment', domain: 'xbox.com' },
];

const SetupWizard = ({ onComplete, isAddMode, onClose }) => {
  const { addMultipleSubscriptions, addSubscription } = useSubscriptions();
  const { logout } = useAuth();
  const [selectedSubs, setSelectedSubs] = useState(new Set());
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Custom form state
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customCycle, setCustomCycle] = useState('Monthly');
  const [customCategory, setCustomCategory] = useState('Entertainment');
  const [customNextBillingDate, setCustomNextBillingDate] = useState('');

  const toggleSubscription = (sub) => {
    const newSet = new Set(selectedSubs);
    if (newSet.has(sub.id)) {
      newSet.delete(sub.id);
    } else {
      newSet.add(sub.id);
    }
    setSelectedSubs(newSet);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const subsToSave = [];
      
      // Collect selected popular subs
      selectedSubs.forEach(id => {
        const sub = POPULAR_SUBSCRIPTIONS.find(s => s.id === id);
        if (sub) {
          subsToSave.push({
            name: sub.name,
            price: sub.price,
            billingCycle: sub.billingCycle,
            category: sub.category,
            nextBillingDate: new Date().toISOString() // Placeholder for next billing date
          });
        }
      });

      // Include custom sub if filled out
      if (customName && customPrice) {
        subsToSave.push({
          name: customName,
          price: parseFloat(customPrice),
          billingCycle: customCycle,
          category: customCategory,
          nextBillingDate: customNextBillingDate || new Date().toISOString()
        });
      }

      if (subsToSave.length > 0) {
        await addMultipleSubscriptions(subsToSave);
      }
      
      if (isAddMode && onClose) {
        onClose();
      } else if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to save subscriptions", error);
      alert("Failed to save subscriptions. Please make sure your Supabase Row-Level Security (RLS) policies allow inserts, or try again later. Error: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipOrCancel = () => {
    if (isAddMode && onClose) {
      onClose();
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
      setLoading(false);
    }
  };

  return (
    <div className="setup-wizard-overlay">
      <div className="setup-wizard-modal">
        {isAddMode ? (
          <button className="text-btn" onClick={handleSkipOrCancel} style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px', zIndex: 10 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : (
          <button className="text-btn" onClick={handleLogout} style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px', color: 'var(--color-secondary)', zIndex: 10 }} title="Sign out">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          </button>
        )}
        <div className="wizard-header">
          <div className="wizard-icon-box">
            <span className="material-symbols-outlined">{isAddMode ? 'library_add' : 'rocket_launch'}</span>
          </div>
          <h2>{isAddMode ? 'Add New Subscriptions' : "Let's set up your Subwise"}</h2>
          <p>{isAddMode ? 'Select the subscriptions you want to add to your dashboard.' : 'Select the subscriptions you already own to instantly populate your dashboard.'}</p>
        </div>

        <div className="wizard-content">
          <div className="popular-subs-grid">
            {POPULAR_SUBSCRIPTIONS.map(sub => {
              const isSelected = selectedSubs.has(sub.id);
              return (
                <div 
                  key={sub.id} 
                  className={`popular-sub-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSubscription(sub)}
                >
                  <div className="sub-logo-wrapper">
                    <img src={`https://www.google.com/s2/favicons?domain=${sub.domain}&sz=128`} alt={sub.name} onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                    <div className="sub-logo-fallback" style={{ display: 'none' }}>
                      {sub.name.charAt(0)}
                    </div>
                  </div>
                  <div className="sub-info">
                    <h4>{sub.name}</h4>
                    <p>${sub.price}/mo</p>
                  </div>
                  <div className="selection-indicator">
                    <span className="material-symbols-outlined">
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="custom-sub-section">
            <button 
              className="text-btn toggle-custom-btn" 
              onClick={() => setIsAddingCustom(!isAddingCustom)}
            >
              <span className="material-symbols-outlined">
                {isAddingCustom ? 'remove' : 'add'}
              </span>
              Don't see yours? Add a custom one
            </button>
            
            {isAddingCustom && (
              <div className="custom-sub-form animate-in">
                <div className="form-group">
                  <label>Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Local Gym"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                  />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Billing Cycle</label>
                    <select value={customCycle} onChange={(e) => setCustomCycle(e.target.value)}>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="form-group-row mt-sm">
                  <div className="form-group">
                    <label>First Billing Date</label>
                    <input 
                      type="date"
                      value={customNextBillingDate}
                      onChange={(e) => setCustomNextBillingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Health">Health</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="wizard-footer">
          <button 
            className="btn-primary w-full" 
            onClick={handleSave}
            disabled={loading || (selectedSubs.size === 0 && !customName)}
          >
            {loading ? 'Saving...' : `Save & Continue (${selectedSubs.size + (customName ? 1 : 0)} selected)`}
          </button>
          <button 
            className="text-btn skip-btn w-full mt-sm" 
            onClick={handleSkipOrCancel}
            disabled={loading}
          >
            {isAddMode ? 'Cancel' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
