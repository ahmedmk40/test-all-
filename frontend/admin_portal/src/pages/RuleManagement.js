import React, { useState } from 'react';
import './RuleManagement.css';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';

const RuleManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  
  // Sample data for rules
  const rules = [
    {
      id: 1,
      name: 'High Value Transaction',
      description: 'Flag transactions above a certain threshold',
      type: 'threshold',
      status: 'active',
      priority: 'high',
      conditions: 'amount > 10000',
      created: '2023-01-15',
      modified: '2023-03-20',
      created_by: 'admin',
      performance: {
        triggers: 245,
        true_positives: 32,
        false_positives: 213,
        efficiency: '13.1%'
      }
    },
    {
      id: 2,
      name: 'Unusual Location',
      description: 'Detect transactions from unusual locations',
      type: 'pattern',
      status: 'active',
      priority: 'medium',
      conditions: 'location != user.common_locations',
      created: '2023-02-10',
      modified: '2023-02-10',
      created_by: 'admin',
      performance: {
        triggers: 189,
        true_positives: 45,
        false_positives: 144,
        efficiency: '23.8%'
      }
    },
    {
      id: 3,
      name: 'Rapid Succession',
      description: 'Multiple transactions in a short time period',
      type: 'velocity',
      status: 'active',
      priority: 'high',
      conditions: 'count > 5 in 10 minutes',
      created: '2023-01-05',
      modified: '2023-03-15',
      created_by: 'john.doe',
      performance: {
        triggers: 312,
        true_positives: 87,
        false_positives: 225,
        efficiency: '27.9%'
      }
    },
    {
      id: 4,
      name: 'New Merchant Type',
      description: 'Transaction with a merchant category not used before',
      type: 'pattern',
      status: 'draft',
      priority: 'low',
      conditions: 'merchant.category not in user.history.categories',
      created: '2023-03-25',
      modified: '2023-03-25',
      created_by: 'admin',
      performance: {
        triggers: 0,
        true_positives: 0,
        false_positives: 0,
        efficiency: 'N/A'
      }
    },
    {
      id: 5,
      name: 'Cross-Border Transaction',
      description: 'Transaction in a different country than home country',
      type: 'pattern',
      status: 'inactive',
      priority: 'medium',
      conditions: 'transaction.country != user.home_country',
      created: '2023-01-20',
      modified: '2023-02-28',
      created_by: 'jane.smith',
      performance: {
        triggers: 156,
        true_positives: 23,
        false_positives: 133,
        efficiency: '14.7%'
      }
    }
  ];
  
  // Filter rules based on active tab and search term
  const filteredRules = rules.filter(rule => {
    const matchesTab = 
      (activeTab === 'active' && rule.status === 'active') ||
      (activeTab === 'draft' && rule.status === 'draft') ||
      (activeTab === 'inactive' && rule.status === 'inactive') ||
      (activeTab === 'all');
    
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const handleRuleClick = (rule) => {
    setSelectedRule(rule);
  };
  
  return (
    <div className="rule-management">
      <div className="page-header">
        <h1>Rule Management</h1>
        <button className="btn btn-primary">
          <FaPlus /> Create New Rule
        </button>
      </div>
      
      <div className="rule-tabs">
        <div 
          className={`rule-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Rules
        </div>
        <div 
          className={`rule-tab ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          Draft Rules
        </div>
        <div 
          className={`rule-tab ${activeTab === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('inactive')}
        >
          Inactive Rules
        </div>
        <div 
          className={`rule-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Rules
        </div>
      </div>
      
      <div className="rule-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search rules..." 
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
            <label>Rule Type</label>
            <select>
              <option value="">All Types</option>
              <option value="threshold">Threshold</option>
              <option value="pattern">Pattern</option>
              <option value="velocity">Velocity</option>
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
            <label>Created By</label>
            <select>
              <option value="">All Users</option>
              <option value="admin">admin</option>
              <option value="john.doe">john.doe</option>
              <option value="jane.smith">jane.smith</option>
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
      
      <div className="rule-container">
        <div className="rule-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map(rule => (
                <tr 
                  key={rule.id} 
                  className={selectedRule && selectedRule.id === rule.id ? 'selected' : ''}
                  onClick={() => handleRuleClick(rule)}
                >
                  <td>{rule.name}</td>
                  <td>
                    <span className={`badge badge-${rule.type}`}>
                      {rule.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-priority-${rule.priority}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-status-${rule.status}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td>{rule.modified}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon">
                        <FaEdit />
                      </button>
                      {rule.status === 'active' ? (
                        <button className="btn-icon warning">
                          <FaTimes />
                        </button>
                      ) : rule.status === 'inactive' ? (
                        <button className="btn-icon success">
                          <FaCheck />
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
        
        {selectedRule && (
          <div className="rule-details">
            <h2>{selectedRule.name}</h2>
            <p className="rule-description">{selectedRule.description}</p>
            
            <div className="detail-section">
              <h3>Rule Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Rule ID</span>
                  <span className="detail-value">{selectedRule.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{selectedRule.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{selectedRule.status}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priority</span>
                  <span className="detail-value">{selectedRule.priority}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">{selectedRule.created}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Modified</span>
                  <span className="detail-value">{selectedRule.modified}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created By</span>
                  <span className="detail-value">{selectedRule.created_by}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Conditions</h3>
              <div className="code-block">
                {selectedRule.conditions}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Performance Metrics</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Total Triggers</span>
                  <span className="detail-value">{selectedRule.performance.triggers}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">True Positives</span>
                  <span className="detail-value">{selectedRule.performance.true_positives}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">False Positives</span>
                  <span className="detail-value">{selectedRule.performance.false_positives}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Efficiency</span>
                  <span className="detail-value">{selectedRule.performance.efficiency}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-actions">
              <button className="btn btn-primary">
                <FaEdit /> Edit Rule
              </button>
              {selectedRule.status === 'active' ? (
                <button className="btn btn-warning">
                  <FaTimes /> Deactivate
                </button>
              ) : selectedRule.status === 'inactive' ? (
                <button className="btn btn-success">
                  <FaCheck /> Activate
                </button>
              ) : null}
              <button className="btn btn-danger">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleManagement;
