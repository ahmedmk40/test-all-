import React, { useState } from 'react';
import './TransactionMonitoring.css';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const TransactionMonitoring = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Sample data for transactions
  const transactions = [
    {
      id: 'TRX-45678',
      timestamp: '2023-03-30 14:25:36',
      amount: 1250.00,
      currency: 'USD',
      type: 'card_payment',
      status: 'pending_review',
      risk_score: 85,
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
      card: {
        last4: '4567',
        brand: 'Visa',
        type: 'Credit'
      },
      alerts: [
        { type: 'high_value', description: 'Transaction amount exceeds threshold' },
        { type: 'unusual_location', description: 'Transaction location differs from customer profile' }
      ],
      signals: [
        { service: 'rule_service', result: 'flag', reason: 'High value transaction rule triggered' },
        { service: 'velocity_service', result: 'pass', reason: 'No velocity issues detected' },
        { service: 'ml_service', result: 'flag', reason: 'ML model predicts high fraud probability' },
        { service: 'block_service', result: 'pass', reason: 'Not on blocklist' }
      ]
    },
    {
      id: 'TRX-45679',
      timestamp: '2023-03-30 13:15:22',
      amount: 89.99,
      currency: 'USD',
      type: 'online_purchase',
      status: 'approved',
      risk_score: 15,
      customer: {
        id: 'CUST-12346',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 234-5678'
      },
      merchant: {
        id: 'MERCH-456',
        name: 'Online Bookstore',
        category: 'Books & Media',
        location: 'Online'
      },
      card: {
        last4: '7890',
        brand: 'Mastercard',
        type: 'Debit'
      },
      alerts: [],
      signals: [
        { service: 'rule_service', result: 'pass', reason: 'No rules triggered' },
        { service: 'velocity_service', result: 'pass', reason: 'No velocity issues detected' },
        { service: 'ml_service', result: 'pass', reason: 'ML model predicts low fraud probability' },
        { service: 'block_service', result: 'pass', reason: 'Not on blocklist' }
      ]
    },
    {
      id: 'TRX-45680',
      timestamp: '2023-03-30 12:05:18',
      amount: 500.00,
      currency: 'USD',
      type: 'wire_transfer',
      status: 'declined',
      risk_score: 95,
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
      card: null,
      alerts: [
        { type: 'velocity', description: 'Multiple transfers in short time period' },
        { type: 'pattern', description: 'Matches known fraud pattern' },
        { type: 'ml_score', description: 'High risk score from ML model' }
      ],
      signals: [
        { service: 'rule_service', result: 'flag', reason: 'Multiple rules triggered' },
        { service: 'velocity_service', result: 'flag', reason: 'Unusual transaction velocity detected' },
        { service: 'ml_service', result: 'flag', reason: 'ML model predicts very high fraud probability' },
        { service: 'block_service', result: 'pass', reason: 'Not on blocklist' }
      ]
    },
    {
      id: 'TRX-45681',
      timestamp: '2023-03-30 11:45:52',
      amount: 150.50,
      currency: 'USD',
      type: 'card_payment',
      status: 'pending_review',
      risk_score: 65,
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
      card: {
        last4: '2345',
        brand: 'Amex',
        type: 'Credit'
      },
      alerts: [
        { type: 'unusual_location', description: 'Transaction location differs from customer profile' }
      ],
      signals: [
        { service: 'rule_service', result: 'pass', reason: 'No rules triggered' },
        { service: 'velocity_service', result: 'pass', reason: 'No velocity issues detected' },
        { service: 'ml_service', result: 'flag', reason: 'ML model predicts moderate fraud probability' },
        { service: 'block_service', result: 'pass', reason: 'Not on blocklist' }
      ]
    },
    {
      id: 'TRX-45682',
      timestamp: '2023-03-30 10:30:15',
      amount: 75.25,
      currency: 'USD',
      type: 'online_purchase',
      status: 'approved',
      risk_score: 10,
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
      card: {
        last4: '6789',
        brand: 'Visa',
        type: 'Debit'
      },
      alerts: [],
      signals: [
        { service: 'rule_service', result: 'pass', reason: 'No rules triggered' },
        { service: 'velocity_service', result: 'pass', reason: 'No velocity issues detected' },
        { service: 'ml_service', result: 'pass', reason: 'ML model predicts low fraud probability' },
        { service: 'block_service', result: 'pass', reason: 'Not on blocklist' }
      ]
    }
  ];
  
  // Filter transactions based on active tab and search term
  const filteredTransactions = transactions.filter(transaction => {
    const matchesTab = 
      (activeTab === 'pending' && transaction.status === 'pending_review') ||
      (activeTab === 'approved' && transaction.status === 'approved') ||
      (activeTab === 'declined' && transaction.status === 'declined') ||
      (activeTab === 'high_risk' && transaction.risk_score >= 75) ||
      (activeTab === 'all');
    
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;
    
    // Handle nested fields
    if (sortField === 'customer.name') {
      aValue = a.customer.name;
      bValue = b.customer.name;
    } else if (sortField === 'merchant.name') {
      aValue = a.merchant.name;
      bValue = b.merchant.name;
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
  
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'declined': return 'badge-danger';
      case 'pending_review': return 'badge-warning';
      default: return '';
    }
  };
  
  const getRiskBadgeClass = (score) => {
    if (score >= 75) return 'badge-danger';
    if (score >= 50) return 'badge-warning';
    return 'badge-success';
  };
  
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };
  
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };
  
  return (
    <div className="transaction-monitoring">
      <div className="page-header">
        <h1>Transaction Monitoring</h1>
      </div>
      
      <div className="transaction-tabs">
        <div 
          className={`transaction-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Transactions
        </div>
        <div 
          className={`transaction-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Review
        </div>
        <div 
          className={`transaction-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </div>
        <div 
          className={`transaction-tab ${activeTab === 'declined' ? 'active' : ''}`}
          onClick={() => setActiveTab('declined')}
        >
          Declined
        </div>
        <div 
          className={`transaction-tab ${activeTab === 'high_risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('high_risk')}
        >
          High Risk
        </div>
      </div>
      
      <div className="transaction-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search transactions..." 
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
            <label>Transaction Type</label>
            <select>
              <option value="">All Types</option>
              <option value="card_payment">Card Payment</option>
              <option value="online_purchase">Online Purchase</option>
              <option value="wire_transfer">Wire Transfer</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Risk Score</label>
            <select>
              <option value="">All Scores</option>
              <option value="high">High (75-100)</option>
              <option value="medium">Medium (50-74)</option>
              <option value="low">Low (0-49)</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Amount Range</label>
            <div className="range-inputs">
              <input type="number" placeholder="Min" />
              <input type="number" placeholder="Max" />
            </div>
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
      
      <div className="transaction-container">
        <div className="transaction-list">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('timestamp')}>
                  Time {getSortIcon('timestamp')}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Amount {getSortIcon('amount')}
                </th>
                <th onClick={() => handleSort('customer.name')}>
                  Customer {getSortIcon('customer.name')}
                </th>
                <th onClick={() => handleSort('merchant.name')}>
                  Merchant {getSortIcon('merchant.name')}
                </th>
                <th onClick={() => handleSort('risk_score')}>
                  Risk {getSortIcon('risk_score')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map(transaction => (
                <tr 
                  key={transaction.id} 
                  className={selectedTransaction && selectedTransaction.id === transaction.id ? 'selected' : ''}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <td>{transaction.id}</td>
                  <td>{formatDateTime(transaction.timestamp)}</td>
                  <td>{formatCurrency(transaction.amount, transaction.currency)}</td>
                  <td>{transaction.customer.name}</td>
                  <td>{transaction.merchant.name}</td>
                  <td>
                    <span className={`badge ${getRiskBadgeClass(transaction.risk_score)}`}>
                      {transaction.risk_score}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                      {transaction.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="View Details">
                        <FaEye />
                      </button>
                      {transaction.status === 'pending_review' && (
                        <>
                          <button className="btn-icon success" title="Approve">
                            <FaCheckCircle />
                          </button>
                          <button className="btn-icon danger" title="Decline">
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedTransaction && (
          <div className="transaction-details">
            <h2>Transaction Details</h2>
            
            <div className="detail-section">
              <h3>Basic Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{selectedTransaction.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Timestamp</span>
                  <span className="detai
(Content truncated due to size limit. Use line ranges to read in chunks)