import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Layout components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RuleManagement from './pages/RuleManagement';
import SystemConfiguration from './pages/SystemConfiguration';
import ServiceMonitoring from './pages/ServiceMonitoring';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Header />
                <div className="page-container">
                  <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/users" component={UserManagement} />
                    <Route path="/rules" component={RuleManagement} />
                    <Route path="/configuration" component={SystemConfiguration} />
                    <Route path="/monitoring" component={ServiceMonitoring} />
                    <Route path="/audit" component={AuditLogs} />
                  </Switch>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
