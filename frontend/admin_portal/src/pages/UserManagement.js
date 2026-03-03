import React, { useState } from 'react';
import './UserManagement.css';
import { FaPlus, FaEdit, FaTrash, FaLock, FaUnlock, FaSearch, FaFilter, FaUserShield } from 'react-icons/fa';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Sample data for users
  const users = [
    {
      id: 1,
      username: 'admin',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'administrator',
      status: 'active',
      lastLogin: '2023-03-30 14:25:36',
      created: '2023-01-01',
      permissions: [
        'user_management',
        'rule_management',
        'system_configuration',
        'transaction_view',
        'transaction_approve',
        'transaction_decline'
      ]
    },
    {
      id: 2,
      username: 'john.doe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'analyst',
      status: 'active',
      lastLogin: '2023-03-29 09:12:45',
      created: '2023-01-15',
      permissions: [
        'transaction_view',
        'transaction_approve',
        'transaction_decline',
        'rule_view'
      ]
    },
    {
      id: 3,
      username: 'jane.smith',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'compliance',
      status: 'active',
      lastLogin: '2023-03-30 11:05:22',
      created: '2023-02-01',
      permissions: [
        'transaction_view',
        'aml_case_management',
        'report_generation'
      ]
    },
    {
      id: 4,
      username: 'robert.johnson',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'analyst',
      status: 'inactive',
      lastLogin: '2023-02-15 16:30:10',
      created: '2023-01-20',
      permissions: [
        'transaction_view',
        'transaction_approve',
        'transaction_decline',
        'rule_view'
      ]
    },
    {
      id: 5,
      username: 'sarah.williams',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'administrator',
      status: 'locked',
      lastLogin: '2023-03-01 08:45:33',
      created: '2023-01-10',
      permissions: [
        'user_management',
        'rule_management',
        'system_configuration',
        'transaction_view',
        'transaction_approve',
        'transaction_decline'
      ]
    }
  ];
  
  // Filter users based on active tab and search term
  const filteredUsers = users.filter(user => {
    const matchesTab = 
      (activeTab === 'active' && user.status === 'active') ||
      (activeTab === 'inactive' && user.status === 'inactive') ||
      (activeTab === 'locked' && user.status === 'locked') ||
      (activeTab === 'all');
    
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };
  
  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="btn btn-primary">
          <FaPlus /> Add New User
        </button>
      </div>
      
      <div className="user-tabs">
        <div 
          className={`user-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Users
        </div>
        <div 
          className={`user-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Users
        </div>
        <div 
          className={`user-tab ${activeTab === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive Users
        </div>
        <div 
          className={`user-tab ${activeTab === 'locked' ? 'active' : ''}`}
          onClick={() => setActiveTab('locked')}
        >
          Locked Users
        </div>
      </div>
      
      <div className="user-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button 
          className="btn btn-filter"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>
      
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Role</label>
            <select>
              <option value="">All Roles</option>
              <option value="administrator">Administrator</option>
              <option value="analyst">Analyst</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Created Date</label>
            <div className="date-inputs">
              <input type="date" placeholder="From" />
              <input type="date" placeholder="To" />
            </div>
          </div>
          <div className="filter-buttons">
            <button className="btn btn-primary">Apply Filters</button>
            <button className="btn btn-secondary">Reset</button>
          </div>
        </div>
      )}
      
      <div className="user-container">
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className={selectedUser && selectedUser.id === user.id ? 'selected' : ''}
                  onClick={() => handleUserClick(user)}
                >
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>
                    <span className={`badge badge-role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastLogin}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon">
                        <FaEdit />
                      </button>
                      {user.status === 'active' ? (
                        <button className="btn-icon warning">
                          <FaLock />
                        </button>
                      ) : user.status === 'locked' || user.status === 'inactive' ? (
                        <button className="btn-icon success">
                          <FaUnlock />
                        </button>
                      ) : null}
                      <button className="btn-icon danger">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedUser && (
          <div className="user-details">
            <div className="user-header">
              <div className="user-avatar">
                <FaUserShield className="avatar-icon" />
              </div>
              <div className="user-info">
                <h2>{selectedUser.name}</h2>
                <p className="user-email">{selectedUser.email}</p>
                <div className="user-badges">
                  <span className={`badge badge-role-${selectedUser.role}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`badge badge-status-${selectedUser.status}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>User Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{selectedUser.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">{selectedUser.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">{selectedUser.created}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Login</span>
                  <span className="detail-value">{selectedUser.lastLogin}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Permissions</h3>
              <div className="permissions-list">
                {selectedUser.permissions.map((permission, index) => (
                  <div key={index} className="permission-item">
                    <span className="permission-name">{permission.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Activity Log</h3>
              <div className="activity-log">
                <div className="log-item">
                  <span className="log-time">2023-03-30 14:25:36</span>
                  <span className="log-action">Logged in</span>
                </div>
                <div className="log-item">
                  <span className="log-time">2023-03-29 16:42:15</span>
                  <span className="log-action">Updated rule "High Value Transaction"</span>
                </div>
                <div className="log-item">
                  <span className="log-time">2023-03-28 11:30:22</span>
                  <span className="log-action">Approved transaction #12345</span>
                </div>
                <div className="log-item">
                  <span className="log-time">2023-03-28 09:15:47</span>
                  <span className="log-action">Logged in</span>
                </div>
                <div className="log-item">
                  <span className="log-time">2023-03-27 17:05:33</span>
                  <span className="log-action">Created new user "jane.smith"</span>
                </div>
              </div>
            </div>
            
            <div className="detail-actions">
              <button className="btn btn-primary">
                <FaEdit /> Edit User
              </button>
              {selectedUser.status === 'active' ? (
                <button className="btn btn-warning">
                  <FaLock /> Lock Account
                </button>
              ) : selectedUser.status === 'locked' || selectedUser.status === 'inactive' ? (
                <button className="btn btn-success">
                  <FaUnlock /> Activate Account
                </button>
              ) : null}
              <button className="btn btn-secondary">
                Reset Password
              </button>
              <button className="btn btn-danger">
                <FaTrash /> Delete User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
