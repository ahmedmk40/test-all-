import React, { useState } from 'react';
import './Header.css';
import { FaBell, FaUser, FaSignOutAlt, FaCog, FaSearch } from 'react-icons/fa';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showProfileMenu) setShowProfileMenu(false);
  };
  
  return (
    <div className="header">
      <div className="header-left">
        <div className="search-container">
          <input type="text" placeholder="Search transactions, alerts, cases..." />
          <FaSearch className="search-icon" />
        </div>
      </div>
      <div className="header-right">
        <div className="notification-container">
          <FaBell className="header-icon" onClick={toggleNotifications} />
          <span className="notification-badge">5</span>
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Alerts</h3>
                <span>Mark all as read</span>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">High Risk Transaction</p>
                    <p className="notification-message">Transaction #45678 flagged for review</p>
                    <p className="notification-time">2 minutes ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">Velocity Alert</p>
                    <p className="notification-message">Multiple transactions from user ID #12345</p>
                    <p className="notification-time">15 minutes ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">Unusual Location</p>
                    <p className="notification-message">Transaction from new location for card ending 4567</p>
                    <p className="notification-time">1 hour ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">Case Assigned</p>
                    <p className="notification-message">You have been assigned to case #789</p>
                    <p className="notification-time">3 hours ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">ML Model Alert</p>
                    <p className="notification-message">Transaction #34567 flagged by ML model</p>
                    <p className="notification-time">5 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="notification-footer">
                <a href="/alerts">View all alerts</a>
              </div>
            </div>
          )}
        </div>
        <div className="profile-container">
          <div className="profile-info" onClick={toggleProfileMenu}>
            <FaUser className="header-icon" />
            <span className="profile-name">Analyst User</span>
          </div>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <ul>
                <li>
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </li>
                <li>
                  <FaCog className="dropdown-icon" />
                  <span>Settings</span>
                </li>
                <li>
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
