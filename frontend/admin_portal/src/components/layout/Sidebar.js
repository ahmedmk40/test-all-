import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaClipboardList, FaCogs, FaChartLine, FaHistory } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Portal</h2>
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
            <Link to="/users" className="sidebar-link">
              <FaUsers className="sidebar-icon" />
              <span>User Management</span>
            </Link>
          </li>
          <li>
            <Link to="/rules" className="sidebar-link">
              <FaClipboardList className="sidebar-icon" />
              <span>Rule Management</span>
            </Link>
          </li>
          <li>
            <Link to="/configuration" className="sidebar-link">
              <FaCogs className="sidebar-icon" />
              <span>System Configuration</span>
            </Link>
          </li>
          <li>
            <Link to="/monitoring" className="sidebar-link">
              <FaChartLine className="sidebar-icon" />
              <span>Service Monitoring</span>
            </Link>
          </li>
          <li>
            <Link to="/audit" className="sidebar-link">
              <FaHistory className="sidebar-icon" />
              <span>Audit Logs</span>
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
