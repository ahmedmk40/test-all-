import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Alerts from './pages/Alerts';
import Cases from './pages/Cases';
import Rules from './pages/Rules';
import AmlCompliance from './pages/AmlCompliance';
import MlModels from './pages/MlModels';
import Reports from './pages/Reports';
import Admin from './pages/Admin';

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  alerts: Alerts,
  cases: Cases,
  rules: Rules,
  aml: AmlCompliance,
  'ml-models': MlModels,
  reports: Reports,
  admin: Admin,
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ActivePage = pages[activePage] || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header activePage={activePage} />
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 28px',
          background: 'var(--slate-50)',
        }}>
          <ActivePage onNavigate={setActivePage} />
        </main>
      </div>
    </div>
  );
}

export default App;
