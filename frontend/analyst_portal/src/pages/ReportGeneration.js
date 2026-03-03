import React, { useState } from 'react';
import './ReportGeneration.css';
import { FaSearch, FaFilter, FaDownload, FaChartBar, FaTable, FaCalendarAlt, FaSort, FaSortUp, FaSortDown, FaFileExport, FaFileAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';

const ReportGeneration = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Sample data for reports
  const reports = [
    {
      id: 'REP-001',
      name: 'Daily Transaction Summary',
      category: 'standard',
      description: 'Summary of all transactions processed in the last 24 hours, including volume, value, and fraud metrics.',
      last_run: '2023-03-30 08:00:00',
      frequency: 'daily',
      format: 'pdf',
      parameters: [
        { name: 'date', type: 'date', required: true, default: 'today' }
      ]
    },
    {
      id: 'REP-002',
      name: 'Weekly Fraud Analysis',
      category: 'standard',
      description: 'Detailed analysis of fraud patterns and trends over the past week, including rule performance and alert distribution.',
      last_run: '2023-03-27 08:00:00',
      frequency: 'weekly',
      format: 'pdf',
      parameters: [
        { name: 'start_date', type: 'date', required: true, default: 'week_start' },
        { name: 'end_date', type: 'date', required: true, default: 'week_end' }
      ]
    },
    {
      id: 'REP-003',
      name: 'Monthly Rule Performance',
      category: 'standard',
      description: 'Comprehensive analysis of rule performance, including true/false positive rates, efficiency, and impact on transaction approval.',
      last_run: '2023-03-01 08:00:00',
      frequency: 'monthly',
      format: 'pdf',
      parameters: [
        { name: 'month', type: 'month', required: true, default: 'current_month' }
      ]
    },
    {
      id: 'REP-004',
      name: 'Transaction Export',
      category: 'data_export',
      description: 'Export of raw transaction data for the specified date range, including all transaction attributes and fraud signals.',
      last_run: '2023-03-29 15:30:22',
      frequency: 'on_demand',
      format: 'csv',
      parameters: [
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date', required: true },
        { name: 'transaction_type', type: 'select', options: ['all', 'card_payment', 'wire_transfer', 'online_purchase'], required: false, default: 'all' }
      ]
    },
    {
      id: 'REP-005',
      name: 'Alert Export',
      category: 'data_export',
      description: 'Export of alert data for the specified date range, including alert details, related transactions, and resolution status.',
      last_run: '2023-03-28 11:45:18',
      frequency: 'on_demand',
      format: 'csv',
      parameters: [
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date', required: true },
        { name: 'alert_type', type: 'select', options: ['all', 'high_value', 'unusual_location', 'velocity', 'ml_score', 'pattern'], required: false, default: 'all' },
        { name: 'status', type: 'select', options: ['all', 'new', 'in_progress', 'resolved'], required: false, default: 'all' }
      ]
    },
    {
      id: 'REP-006',
      name: 'Case Export',
      category: 'data_export',
      description: 'Export of case data for the specified date range, including case details, related alerts, notes, and resolution status.',
      last_run: '2023-03-25 09:30:45',
      frequency: 'on_demand',
      format: 'csv',
      parameters: [
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date', required: true },
        { name: 'status', type: 'select', options: ['all', 'open', 'in_progress', 'escalated', 'closed'], required: false, default: 'all' }
      ]
    },
    {
      id: 'REP-007',
      name: 'Custom Transaction Analysis',
      category: 'custom',
      description: 'Customizable analysis of transaction data with user-defined filters, groupings, and metrics.',
      last_run: '2023-03-26 14:22:33',
      frequency: 'on_demand',
      format: 'pdf',
      parameters: [
        { name: 'start_date', type: 'date', required: true },
        { name: 'end_date', type: 'date', required: true },
        { name: 'group_by', type: 'select', options: ['day', 'week', 'month', 'transaction_type', 'merchant_category', 'customer_segment'], required: true },
        { name: 'metrics', type: 'multi_select', options: ['volume', 'value', 'average', 'fraud_rate', 'decline_rate'], required: true },
        { name: 'filters', type: 'complex', required: false }
      ]
    },
    {
      id: 'REP-008',
      name: 'Executive Dashboard',
      category: 'custom',
      description: 'High-level overview of key fraud metrics and trends for executive review.',
      last_run: '2023-03-01 09:00:00',
      frequency: 'monthly',
      format: 'pdf',
      parameters: [
        { name: 'month', type: 'month', required: true, default: 'current_month' },
        { name: 'include_comparison', type: 'boolean', required: false, default: true }
      ]
    }
  ];
  
  // Filter reports based on active tab and search term
  const filteredReports = reports.filter(report => {
    const matchesTab = 
      (activeTab === 'standard' && report.category === 'standard') ||
      (activeTab === 'data_export' && report.category === 'data_export') ||
      (activeTab === 'custom' && report.category === 'custom') ||
      (activeTab === 'all');
    
    const matchesSearch = 
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
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
  
  const handleReportClick = (report) => {
    setSelectedReport(report);
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };
  
  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return <FaFilePdf />;
      case 'csv': return <FaFileExcel />;
      case 'excel': return <FaFileExcel />;
      default: return <FaFileAlt />;
    }
  };
  
  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'on_demand': return 'On Demand';
      default: return frequency;
    }
  };
  
  const runReport = (report) => {
    // In a real application, this would trigger the report generation
    alert(`Generating report: ${report.name}`);
  };
  
  const scheduleReport = (report) => {
    // In a real application, this would open a scheduling dialog
    alert(`Scheduling report: ${report.name}`);
  };
  
  return (
    <div className="report-generation">
      <div className="page-header">
        <h1>Report Generation</h1>
      </div>
      
      <div className="report-tabs">
        <div 
          className={`report-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Reports
        </div>
        <div 
          className={`report-tab ${activeTab === 'standard' ? 'active' : ''}`}
          onClick={() => setActiveTab('standard')}
        >
          Standard Reports
        </div>
        <div 
          className={`report-tab ${activeTab === 'data_export' ? 'active' : ''}`}
          onClick={() => setActiveTab('data_export')}
        >
          Data Exports
        </div>
        <div 
          className={`report-tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Custom Reports
        </div>
      </div>
      
      <div className="report-actions">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search reports..." 
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
            <label>Category</label>
            <select>
              <option value="">All Categories</option>
              <option value="standard">Standard Reports</option>
              <option value="data_export">Data Exports</option>
              <option value="custom">Custom Reports</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Frequency</label>
            <select>
              <option value="">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="on_demand">On Demand</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Format</label>
            <select>
              <option value="">All Formats</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
          <div className="filter-buttons">
            <button className="btn btn-primary">Apply Filters</button>
            <button className="btn btn-secondary">Reset</button>
          </div>
        </div>
      )}
      
      <div className="report-container">
        <div className="report-list">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('name')}>
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('category')}>
                  Category {getSortIcon('category')}
                </th>
                <th onClick={() => handleSort('frequency')}>
                  Frequency {getSortIcon('frequency')}
                </th>
                <th onClick={() => handleSort('last_run')}>
                  Last Run {getSortIcon('last_run')}
                </th>
                <th onClick={() => handleSort('format')}>
                  Format {getSortIcon('format')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedReports.map(report => (
                <tr 
                  key={report.id} 
                  className={selectedReport && selectedReport.id === report.id ? 'selected' : ''}
                  onClick={() => handleReportClick(report)}
                >
                  <td>{report.id}</td>
                  <td>{report.name}</td>
                  <td className="capitalize">{report.category.replace('_', ' ')}</td>
                  <td>{getFrequencyLabel(report.frequency)}</td>
                  <td>{formatDateTime(report.last_run)}</td>
                  <td className="format-cell">
                    <span className="format-icon">{getFormatIcon(report.format)}</span>
                    <span className="format-text">{report.format.toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Run Report" onClick={() => runReport(report)}>
                        <FaChartBar />
                      </button>
                      <button className="btn-icon" title="Schedule Report" onClick={() => scheduleReport(report)}>
                        <FaCalendarAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {selectedReport && (
          <div className="report-details">
            <h2>{selectedReport.name}</h2>
            
            <div className="detail-section">
              <h3>Report Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Report ID</span>
                  <span className="detail-value">{selectedReport.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value capitalize">{selectedReport.category.replace('_', ' ')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Frequency</span>
                  <span className="detail-value">{getFrequencyLabel(selectedReport.frequency)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value format-value">
                    {getFormatIcon(selectedReport.format)}
                    <span>{selectedReport.format.toUpperCase()}</span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Run</span>
                  <span className="detail-value">{formatDateTime(selectedReport.last_run)}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h3>Description</h3>
              <p className="report-description">{selectedReport.description}</p>
            </div>
            
            <div className="detail-section">
              <h3>Parameters</h3>
              <div className="parameters-form">
                {selectedReport.parameters.map((param, index) => (
                  <div key={index} className="parameter-item">
                    <label className="parameter-label">
                      {param.name.replace('_', ' ')}
                      {param.required && <span className="required">*</span>}
                    </label>
                    
                    {param.type === 'date' && (
                      <input 
                        type="date" 
                        className="parameter-input"
                        defaultValue={param.default === 'today' ? new Date().toISOString().split('T')[0] : ''}
                      />
                    )}
                    
                    {param.type === 'month' && (
    
(Content truncated due to size limit. Use line ranges to read in chunks)