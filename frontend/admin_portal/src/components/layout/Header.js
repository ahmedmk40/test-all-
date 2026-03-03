import React, { useState } from 'react';
import './Header.css';
import { FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

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
        <h2>Transaction Monitoring System</h2>
      </div>
      <div className="header-right">
        <div className="notification-container">
          <FaBell className="header-icon" onClick={toggleNotifications} />
          <span className="notification-badge">3</span>
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span>Mark all as read</span>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">System Alert</p>
                    <p className="notification-message">High volume of declined transactions detected</p>
                    <p className="notification-time">2 minutes ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">Rule Update</p>
                    <p className="notification-message">Rule "High Value Transaction" was updated</p>
                    <p className="notification-time">1 hour ago</p>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-content">
                    <p className="notification-title">New User</p>
                    <p className="notification-message">User "John Doe" was added to the system</p>
                    <p className="notification-time">3 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="notification-footer">
                <a href="/notifications">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        <div className="profile-container">
          <div className="profile-info" onClick={toggleProfileMenu}>
            <FaUser className="header-icon" />
            <span className="profile-name">Admin User</span>
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
