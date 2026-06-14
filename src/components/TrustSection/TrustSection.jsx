import React from 'react';
import './TrustSection.css';

const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="trust-container">
        <div className="trust-icon">
          <span className="material-symbols-outlined">shield_lock</span>
        </div>
        <div className="trust-content">
          <h2>100% User Controlled. <span>No Credit Cards Required.</span></h2>
          <p>
            Subwise is designed to provide financial insights and subscription management advice without ever putting your privacy at risk. 
            We <strong>do not</strong> ask for or store your credit card information. 
          </p>
          <p>
            Any decision to cancel or modify a subscription is made independently by you. 
            We simply provide direct deep-links to your official service providers (e.g. Netflix, Spotify) so you can easily manage your billing securely on their official platforms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
