import React, { useState } from 'react';
import './AddSubscriptionModal.css';
import { useSubscriptions } from '../../lib/SubscriptionContext';

const AddSubscriptionModal = ({ isOpen, onClose }) => {
  const { addSubscription } = useSubscriptions();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Entertainment',
    price: '',
    billingCycle: 'Monthly',
    nextBillingDate: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.nextBillingDate) return;

    try {
      await addSubscription({
        ...formData,
        price: parseFloat(formData.price),
      });
      
      // Reset form and close
      setFormData({
        name: '',
        category: 'Entertainment',
        price: '',
        billingCycle: 'Monthly',
        nextBillingDate: '',
      });
      onClose();
    } catch (error) {
      console.error("Failed to add subscription", error);
      alert("Failed to add subscription. Please make sure your Supabase Row-Level Security (RLS) policies allow inserts. Error: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Subscription</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-sub-form">
          <div className="form-group">
            <label htmlFor="name">Service Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g., Netflix, Spotify"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="9.99"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="billingCycle">Billing Cycle</label>
              <select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Utilities">Utilities</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nextBillingDate">Next Billing Date</label>
              <input
                type="date"
                id="nextBillingDate"
                name="nextBillingDate"
                value={formData.nextBillingDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
