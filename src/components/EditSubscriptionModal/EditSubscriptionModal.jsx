import React, { useState } from 'react';
import '../AddSubscriptionModal/AddSubscriptionModal.css';
import { useSubscriptions } from '../../lib/SubscriptionContext';

const EditSubscriptionModal = ({ sub, onClose }) => {
  const { updateSubscription, removeSubscription } = useSubscriptions();
  const [formData, setFormData] = useState({
    name: sub.name,
    category: sub.category || 'Other',
    price: sub.price,
    billingCycle: sub.billingCycle || 'Monthly',
    nextBillingDate: sub.nextBillingDate || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    await updateSubscription(sub.id, {
      ...formData,
      price: parseFloat(formData.price),
    });
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${sub.name}?`)) {
      await removeSubscription(sub.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Subscription</h2>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-sub-form">
          <div className="form-group">
            <label htmlFor="name">Service Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input type="number" id="price" name="price" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="billingCycle">Billing Cycle</label>
              <select id="billingCycle" name="billingCycle" value={formData.billingCycle} onChange={handleChange}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="TV & Streaming">TV & Streaming</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Software & AI">Software & AI</option>
                <option value="Utilities">Utilities</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nextBillingDate">Next Billing Date</label>
              <input type="date" id="nextBillingDate" name="nextBillingDate" value={formData.nextBillingDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" className="text-btn" style={{color: 'var(--color-error)'}} onClick={handleDelete}>
              Delete
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubscriptionModal;
