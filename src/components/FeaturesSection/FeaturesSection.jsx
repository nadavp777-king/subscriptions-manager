import React from 'react';
import FeatureCard from '../FeatureCard/FeatureCard';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'dashboard_customize',
      title: 'Unified View',
      description: 'A singular, transparent dashboard for every digital commitment you own.'
    },
    {
      icon: 'notifications_active',
      title: 'Smart Alerts',
      description: 'Predictive notifications before trials end or prices increase. Never overpay again.'
    },
    {
      icon: 'insights',
      title: 'Spend Insights',
      description: 'Advanced analytics to identify leaks and optimize your recurring overhead.'
    },
    {
      icon: 'shield_with_heart',
      title: 'Bank-Grade Security',
      description: 'Your data is protected with 256-bit encryption and top-tier security protocols.'
    }
  ];

  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="section-title">Designed for precision</h2>
        <p className="section-subtitle">Every tool you need to master your subscription ecosystem.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
