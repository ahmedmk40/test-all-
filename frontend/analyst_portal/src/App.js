import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Layout components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Pages
import Dashboard from './pages/Dashboard';
import TransactionMonitoring from './pages/TransactionMonitoring';
import AlertManagement from './pages/AlertManagement';
import CaseManagement from './pages/CaseManagement';
import ReportGeneration from './pages/ReportGeneration';
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
                    <Route path="/transactions" component={TransactionMonitoring} />
                    <Route path="/alerts" component={AlertManagement} />
                    <Route path="/cases" component={CaseManagement} />
                    <Route path="/reports" component={ReportGeneration} />
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
