import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Creative Director',
      text: 'Subwise saved me over $150 in the first month by catching subscriptions I had completely forgotten about. The UI is stunningly clean.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-IPinalTbnMjmcT4zwDYdtt9B9Xoq0CFRMnfz5h5HMwIwOqwBcE4TICRV7IdcJ0VpbVHTKTPQ7DQV4B9WZwolyq_466Qy_NzzKqlMRXwkMaugGQZMkM2F0Y9DDqvQcjjERpPk4EAbfbSCmCWDkyCtDcAonrHeX8_2Sx9WimRkKd6ndLW5pjWCSNeRGotXorSeCB4NMuS0DaaJYEUgG2QfFcok3SWOo_UGjRlY-eGfGxtDnisZJcp9jx-KLsVm2uQR7kOtXGUtdzI2'
    },
    {
      name: 'Michael Chen',
      role: 'Tech Lead',
      text: 'As someone who manages dozens of SaaS tools, Subwise is a lifesaver. The alerts for price hikes are particularly helpful.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4nWMm71S5tJ17iEYqWuIhu34_AviJYAhrZ64ugR99LEkjGKrhmgx16uTHYwPFJRVer-5dxgY1PaYkDZPWYkjn2LFvfnUmKOKJHc5-LIelvD-x-jUHYYFcK44T_lMvak9W90ah6tWxrPTTgrMcM78zNTrIOVdc5Fy_eaGsiBDDgjqG86KEZZZNQtT4AvQIssHayR0MO5DRai9cMQKNEc8IkADGhdXdEETQebtzEo0Do9p8upiMVFfOn-FbLMJeR0PeMAymvCSILCNz'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2 className="section-title">What our users say</h2>
        <p className="section-subtitle">Join thousands of people who have optimized their finances.</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
              <div className="author-info">
                <p className="author-name">{testimonial.name}</p>
                <p className="author-role">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
