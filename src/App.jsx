import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import OnboardingPage from './pages/OnboardingPage/OnboardingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import SubscriptionPage from './pages/SubscriptionPage/SubscriptionPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OnboardingPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subscriptions" element={<SubscriptionPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          {/* Detail view for specific subscription if needed separately */}
          <Route path="subscription/:id" element={<SubscriptionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
