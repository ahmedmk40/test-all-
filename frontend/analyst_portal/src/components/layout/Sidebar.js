import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaBell, FaFolder, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Analyst Portal</h2>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li>
            <Link to="/" className="sidebar-link">
              <FaHome className="sidebar-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/transactions" className="sidebar-link">
              <FaExchangeAlt className="sidebar-icon" />
              <span>Transaction Monitoring</span>
            </Link>
          </li>
          <li>
            <Link to="/alerts" className="sidebar-link">
              <FaBell className="sidebar-icon" />
              <span>Alert Management</span>
            </Link>
          </li>
          <li>
            <Link to="/cases" className="sidebar-link">
              <FaFolder className="sidebar-icon" />
              <span>Case Management</span>
            </Link>
          </li>
          <li>
            <Link to="/reports" className="sidebar-link">
              <FaChartBar className="sidebar-icon" />
              <span>Report Generation</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
        <p>Transaction Monitoring System</p>
        <p>v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
