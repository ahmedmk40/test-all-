import React, { useState } from 'react';
import './AlertManagement.css';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown, FaFolder } from 'react-icons/fa';

const AlertManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Sample data for alerts
  const alerts = [
    {
      id: 'ALERT-001',
      timestamp: '2023-03-30 14:25:36',
      type: 'high_value',
      status: 'new',
      priority: 'high',
      transaction: {
        id: 'TRX-45678',
        amount: 1250.00,
        currency: 'USD',
        type: 'card_payment'
      },
      customer: {
        id: 'CUST-12345',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567'
      },
      merchant: {
        id: 'MERCH-789',
        name: 'Electronics Superstore',
        category: 'Electronics',
        location: 'New York, USA'
      },
      description: 'Transaction amount exceeds threshold',
      details: 'Transaction amount of $1,250.00 exceeds the threshold of $1,000.00 for this customer profile.',
      rule: {
        id: 'RULE-123',
        name: 'High Value Transaction',
        description: 'Flags transactions with amounts exceeding customer profile thresholds'
      }
    },
    {
      id: 'ALERT-002',
      timestamp: '2023-03-30 13:15:22',
      type: 'unusual_location',
      status: 'new',
      priority: 'medium',
      transaction: {
        id: 'TRX-45681',
        amount: 150.50,
        currency: 'USD',
        type: 'card_payment'
      },
      customer: {
        id: 'CUST-12348',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 456-7890'
      },
      merchant: {
        id: 'MERCH-567',
        name: 'Fashion Outlet',
        category: 'Clothing & Accessories',
        location: 'Los Angeles, USA'
      },
      description: 'Transaction location differs from customer profile',
      details: 'Customer typically transacts in New York area. This transaction was made in Los Angeles, which is 2,800 miles from the customer\'s usual location.',
      rule: {
        id: 'RULE-124',
        name: 'Unusual Location',
        description: 'Flags transactions made in locations far from customer\'s usual activity'
      }
    },
    {
      id: 'ALERT-003',
      timestamp: '2023-03-30 12:05:18',
      type: 'velocity',
      status: 'in_progress',
      priority: 'high',
      transaction: {
        id: 'TRX-45680',
        amount: 500.00,
        currency: 'USD',
        type: 'wire_transfer'
      },
      customer: {
        id: 'CUST-12347',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 345-6789'
      },
      merchant: {
        id: 'MERCH-123',
        name: 'International Transfers Inc',
        category: 'Financial Services',
        location: 'Miami, USA'
      },
      description: 'Multiple transfers in short time period',
      details: 'Customer has made 5 wire transfers in the last 24 hours totaling $2,500.00. This exceeds the velocity threshold of 3 transfers per 24 hours.',
      rule: {
        id: 'RULE-125',
        name: 'Transfer Velocity',
        description: 'Flags customers making multiple transfers in a short time period'
      }
    },
    {
      id: 'ALERT-004',
      timestamp: '2023-03-30 11:45:52',
      type: 'ml_score',
      status: 'in_progress',
      priority: 'medium',
      transaction: {
        id: 'TRX-45681',
        amount: 150.50,
        currency: 'USD',
        type: 'card_payment'
      },
      customer: {
        id: 'CUST-12348',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 456-7890'
      },
      merchant: {
        id: 'MERCH-567',
        name: 'Fashion Outlet',
        category: 'Clothing & Accessories',
        location: 'Los Angeles, USA'
      },
      description: 'High risk score from ML model',
      details: 'ML model predicted a fraud probability of 0.78, which exceeds the threshold of 0.65 for medium risk alerts.',
      rule: {
        id: 'RULE-126',
        name: 'ML Risk Score',
        description: 'Flags transactions with high ML model risk scores'
      }
    },
    {
      id: 'ALERT-005',
      timestamp: '2023-03-30 10:30:15',
      type: 'pattern',
      status: 'resolved',
      priority: 'high',
      transaction: {
        id: 'TRX-45682',
        amount: 75.25,
        currency: 'USD',
        type: 'online_purchase'
      },
      customer: {
        id: 'CUST-12349',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        phone: '+1 (555) 567-8901'
      },
      merchant: {
        id: 'MERCH-890',
        name: 'Grocery Delivery',
        category: 'Groceries',
        location: 'Online'
      },
      description: 'Matches known fraud pattern',
      details: 'Transaction matches pattern ID FP-123: Small online purchase followed by larger in-store purchases within 24 hours.',
      rule: {
        id: 'RULE-127',
        name: 'Fraud Pattern Detection',
        description: 'Flags transactions matching known fraud patterns'
      },
      resolution: {
        timestamp: '2023-03-30 11:15:22',
        analyst: 'Jane Analyst',
        action: 'false_positive',
        notes: 'Confirmed with customer that all transactions were legitimate. Customer was traveling and making purchases in different locations.'
      }
    }
  ];
  
  // Filter alerts based on active tab and search term
  const filteredAlerts = alerts.filter(alert => {
    const matchesTab = 
      (activeTab === 'new' && alert.status === 'new') ||
      (activeTab === 'in_progress' && alert.status === 'in_progress') ||
      (activeTab === 'resolved' && alert.status === 'resolved') ||
      (activeTab === 'high_priority' && alert.priority === 'high') ||
      (activeTab === 'all');
    
    const matchesSearch = 
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Sort alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    let aValue, bValue;
    
    // Handle nested fields
    if (sortField === 'customer.name') {
      aValue = a.customer.name;
      bValue = b.customer.name;
    } else if (sortField === 'transaction.id') {
      aValue = a.transaction.id;
      bValue = b.transaction.id;
    } else if (sortField === 'transaction.amount') {
      aValue = a.transaction.amount;
      bValue = b.transaction.amount;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }
    
    // Handle different data types
    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
  });
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'new': return 'badge-warning';
      case 'in_progress': return 'badge-info';
      case 'resolved': return 'badge-success';
      default: return '';
    }
  };
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-info';
      default: return '';
    }
  };
  
  const getAlertTypeIcon = (type) => {
    switch (type) {
      case 'high_value': return '💰';
      case 'unusual_location': return '🌎';
      case 'velocity': return '⚡';
      case 'ml_score': return '🤖';
      case 'pattern': return '🔍';
      default: return '⚠️';
    }
  };
  
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };
  
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };
  
  const createCase = (alert) => {
    // In a real application, this would create a case and update the alert
    alert('Case created for alert ' + alert.id);
  };
  
  const resolveAlert = (alert, resolution) => {
    // In a real application, this would update the alert status
    alert(`Alert ${alert.id} marked as ${resolution}`);
  };
  
  return (
    <div className="alert-management">
      <div className="page-header">
        <h1>Alert Management</h1>
      </div>
      
      <div className="alert-tabs">
        <div 
          className={`alert-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Alerts
        </div>
        <div 
          className={`alert-tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New
        </div>
        <div 
          className={`alert-tab ${activeTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress
        </div>
        <div 
          className={`alert-tab ${activeTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolved')}
        >
          Resolved
        </div>
        <div 
          className={`alert-tab ${activeTab === 'high_priority' ? 'active' : ''}`}
          onClick={() => setActiveTab('high_priority')}
        >
          High Priority
        </div>
      </div>
      
      <div className="alert-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search alerts..." 
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
            <label>Alert Type</label>
            <select>
              <option value="">All Types</option>
              <option value="high_value">High Value</option>
              <option value="unusual_location">Unusual Location</option>
              <option value="velocity">Velocity</option>
              <option value="ml_score">ML Score</option>
              <option value="pattern">Pattern</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Priority</label>
            <select>
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
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
      
      <div className="alert-container">
        <div className="alert-list">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('timestamp')}>
                  Time {getSortIcon('timestamp')}
                </th>
                <th onClick={() => handleSort('type')}>
                  Type {getSortIcon('type')}
                </th>
                <th onClick={() => handleSort('customer.name')}>
                  Customer {getSortIcon('customer.name')}
                </th>
                <th onClick={() => handleSort('transaction.id')}>
                  Transaction {getSortIcon('transaction.id')}
                </th>
                <th onClick={() => handleSort('transaction.amount')}>
                  Amount {getSortIcon('transaction.amount')}
                </th>
                <th onClick={() => handleSort('priority')}>
                  Priority {getSortIcon('priority')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAlerts.map(alert => (
                <tr 
                  key={alert.id} 
                  className={selectedAlert && selectedAlert.id === alert.id ? 'selected' : ''}
                  onClick={() => handleAlertClick(alert)}
                >
                  <td>{alert.id}</td>
                  <td>{formatDateTime(alert.timestamp)}</td>
                  <td>
                    <span className="alert-type-icon" title={alert.type.replace('_', ' ')}>
                      {getAlertTypeIcon(alert.type)}
                    </span>
                    <span className="alert-type-text">{alert.type.replace('_', ' ')}</span>
                  </td>
                  <td>{alert.customer.name}</td>
                  <td>{alert.transaction.id}</td>
                  <td>{formatCurrency(alert.transaction.amount, alert.transaction.currency)}</td>
                  <td>
                    <span className={`badge ${getPriorityBadgeClass(alert.priority)}`}>
                      {alert.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(alert.status)}`}>
                      {alert.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="View Details">
                        <FaEye />
                      </button>
                      {alert.status !== 'resolved' && (
                        <>
                          <button className="btn-icon success" title="Mark as False Positive">
                            <FaCheckCircle />
                          </button>
                          <button className="btn-icon warning" title="Create Case">
                            <FaFolder />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </t
(Content truncated due to size limit. Use line ranges to read in chunks)