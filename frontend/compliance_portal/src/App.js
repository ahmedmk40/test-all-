import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CompliancePortal from './pages/CompliancePortal';
import RegulatoryReporting from './pages/RegulatoryReporting';
import WatchlistManagement from './pages/WatchlistManagement';
import RiskAssessment from './pages/RiskAssessment';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<CompliancePortal />} />
              <Route path="/aml-cases" element={<CompliancePortal />} />
              <Route path="/regulatory-reporting" element={<RegulatoryReporting />} />
              <Route path="/watchlist-management" element={<WatchlistManagement />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
