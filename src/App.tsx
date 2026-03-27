/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';
import CMSDashboard from './components/CMSDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';

export default function App() {
  useEffect(() => {
    // Track visit on mount
    fetch('/api/analytics/track-visit', { method: 'POST' }).catch(console.error);
  }, []);

  return (
    <Router>
      <main className="bg-bg text-ink min-h-screen">
        <ThreeBackground />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cms" element={<CMSDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}
