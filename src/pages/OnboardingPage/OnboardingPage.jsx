import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import TrustSection from '../../components/TrustSection/TrustSection';
import TestimonialsSection from '../../components/TestimonialsSection/TestimonialsSection';

const OnboardingPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TrustSection />
      <TestimonialsSection />
    </>
  );
};

export default OnboardingPage;
