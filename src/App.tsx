/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThreeBackground from './components/ThreeBackground';
import AIChatPage from './components/AIChatPage';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';
import CMSDashboard from './components/CMSDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AIProjectBuilder from './components/AIProjectBuilder';

export default function App() {
  return (
    <Router>
      <main className="bg-bg text-ink min-h-screen">
        <ThreeBackground />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai" element={<AIChatPage />} />
          <Route path="/project-builder" element={<AIProjectBuilder />} />
        </Routes>
      </main>
    </Router>
  );
}
