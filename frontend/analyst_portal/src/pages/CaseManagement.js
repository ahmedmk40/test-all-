import React, { useState } from 'react';
import './CaseManagement.css';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown, FaComments, FaFileAlt, FaUserEdit } from 'react-icons/fa';

const CaseManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  
  // Sample data for cases
  const cases = [
    {
      id: 'CASE-001',
      title: 'High Value Transaction Investigation',
      created_at: '2023-03-28 09:15:22',
      updated_at: '2023-03-30 14:25:36',
      status: 'open',
      priority: 'high',
      assigned_to: 'John Analyst',
      created_by: 'System',
      customer: {
        id: 'CUST-12345',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567'
      },
      related_alerts: [
        { id: 'ALERT-001', type: 'high_value', timestamp: '2023-03-28 09:15:22' }
      ],
      related_transactions: [
        { 
          id: 'TRX-45678', 
          timestamp: '2023-03-28 09:14:36', 
          amount: 1250.00, 
          currency: 'USD', 
          type: 'card_payment',
          status: 'pending_review'
        }
      ],
      notes: [
        {
          id: 'NOTE-001',
          timestamp: '2023-03-28 09:15:22',
          author: 'System',
          content: 'Case automatically created from Alert ALERT-001'
        },
        {
          id: 'NOTE-002',
          timestamp: '2023-03-28 10:30:15',
          author: 'John Analyst',
          content: 'Reviewing transaction details. Customer has no previous high value transactions in the last 6 months.'
        },
        {
          id: 'NOTE-003',
          timestamp: '2023-03-30 14:25:36',
          author: 'John Analyst',
          content: 'Called customer to verify transaction. Customer confirmed purchase of electronics equipment for their business.'
        }
      ],
      documents: [
        {
          id: 'DOC-001',
          name: 'Transaction Receipt',
          type: 'pdf',
          uploaded_at: '2023-03-28 11:45:22',
          uploaded_by: 'John Analyst'
        }
      ]
    },
    {
      id: 'CASE-002',
      title: 'Unusual Location Activity',
      created_at: '2023-03-27 14:22:45',
      updated_at: '2023-03-29 16:30:12',
      status: 'in_progress',
      priority: 'medium',
      assigned_to: 'Sarah Analyst',
      created_by: 'System',
      customer: {
        id: 'CUST-12348',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 456-7890'
      },
      related_alerts: [
        { id: 'ALERT-002', type: 'unusual_location', timestamp: '2023-03-27 14:22:45' }
      ],
      related_transactions: [
        { 
          id: 'TRX-45681', 
          timestamp: '2023-03-27 14:20:52', 
          amount: 150.50, 
          currency: 'USD', 
          type: 'card_payment',
          status: 'pending_review'
        }
      ],
      notes: [
        {
          id: 'NOTE-004',
          timestamp: '2023-03-27 14:22:45',
          author: 'System',
          content: 'Case automatically created from Alert ALERT-002'
        },
        {
          id: 'NOTE-005',
          timestamp: '2023-03-28 09:15:22',
          author: 'Sarah Analyst',
          content: 'Customer typically transacts in New York area. This transaction was made in Los Angeles.'
        },
        {
          id: 'NOTE-006',
          timestamp: '2023-03-29 16:30:12',
          author: 'Sarah Analyst',
          content: 'Attempted to contact customer via phone but no answer. Sent email requesting verification of transaction.'
        }
      ],
      documents: []
    },
    {
      id: 'CASE-003',
      title: 'Multiple Transfer Investigation',
      created_at: '2023-03-26 11:05:33',
      updated_at: '2023-03-30 10:45:18',
      status: 'closed',
      priority: 'high',
      assigned_to: 'Michael Analyst',
      created_by: 'System',
      customer: {
        id: 'CUST-12347',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 345-6789'
      },
      related_alerts: [
        { id: 'ALERT-003', type: 'velocity', timestamp: '2023-03-26 11:05:33' }
      ],
      related_transactions: [
        { 
          id: 'TRX-45670', 
          timestamp: '2023-03-26 08:14:36', 
          amount: 500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed'
        },
        { 
          id: 'TRX-45671', 
          timestamp: '2023-03-26 09:22:15', 
          amount: 500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed'
        },
        { 
          id: 'TRX-45672', 
          timestamp: '2023-03-26 10:05:42', 
          amount: 500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed'
        },
        { 
          id: 'TRX-45673', 
          timestamp: '2023-03-26 10:45:18', 
          amount: 500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed'
        },
        { 
          id: 'TRX-45680', 
          timestamp: '2023-03-26 11:05:18', 
          amount: 500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'declined'
        }
      ],
      notes: [
        {
          id: 'NOTE-007',
          timestamp: '2023-03-26 11:05:33',
          author: 'System',
          content: 'Case automatically created from Alert ALERT-003'
        },
        {
          id: 'NOTE-008',
          timestamp: '2023-03-26 13:45:22',
          author: 'Michael Analyst',
          content: 'Customer has made 5 wire transfers in the last 24 hours totaling $2,500.00. This exceeds the velocity threshold of 3 transfers per 24 hours.'
        },
        {
          id: 'NOTE-009',
          timestamp: '2023-03-27 10:15:33',
          author: 'Michael Analyst',
          content: 'Contacted customer who confirmed they are splitting payments to multiple vendors for a home renovation project. Verified legitimate purpose.'
        },
        {
          id: 'NOTE-010',
          timestamp: '2023-03-30 10:45:18',
          author: 'Michael Analyst',
          content: 'Case resolved as false positive. Customer advised on better payment practices to avoid triggering velocity alerts in the future.'
        }
      ],
      documents: [
        {
          id: 'DOC-002',
          name: 'Customer Statement',
          type: 'pdf',
          uploaded_at: '2023-03-27 11:30:45',
          uploaded_by: 'Michael Analyst'
        },
        {
          id: 'DOC-003',
          name: 'Vendor Invoices',
          type: 'zip',
          uploaded_at: '2023-03-27 11:35:22',
          uploaded_by: 'Michael Analyst'
        }
      ],
      resolution: {
        timestamp: '2023-03-30 10:45:18',
        resolved_by: 'Michael Analyst',
        resolution_type: 'false_positive',
        reason: 'Legitimate customer activity',
        actions_taken: 'Customer educated on payment practices'
      }
    },
    {
      id: 'CASE-004',
      title: 'ML Model Alert Investigation',
      created_at: '2023-03-25 16:45:12',
      updated_at: '2023-03-29 09:30:45',
      status: 'escalated',
      priority: 'high',
      assigned_to: 'Jane Analyst',
      created_by: 'System',
      customer: {
        id: 'CUST-12350',
        name: 'Thomas Wilson',
        email: 'thomas.wilson@example.com',
        phone: '+1 (555) 678-9012'
      },
      related_alerts: [
        { id: 'ALERT-004', type: 'ml_score', timestamp: '2023-03-25 16:45:12' }
      ],
      related_transactions: [
        { 
          id: 'TRX-45690', 
          timestamp: '2023-03-25 16:42:36', 
          amount: 3500.00, 
          currency: 'USD', 
          type: 'online_purchase',
          status: 'pending_review'
        }
      ],
      notes: [
        {
          id: 'NOTE-011',
          timestamp: '2023-03-25 16:45:12',
          author: 'System',
          content: 'Case automatically created from Alert ALERT-004'
        },
        {
          id: 'NOTE-012',
          timestamp: '2023-03-26 09:30:22',
          author: 'Jane Analyst',
          content: 'ML model predicted a fraud probability of 0.92, which is extremely high. Transaction shows unusual pattern compared to customer history.'
        },
        {
          id: 'NOTE-013',
          timestamp: '2023-03-27 14:15:33',
          author: 'Jane Analyst',
          content: 'Attempted to contact customer via phone and email with no response. Card has been used for 3 additional attempts at different merchants.'
        },
        {
          id: 'NOTE-014',
          timestamp: '2023-03-29 09:30:45',
          author: 'Jane Analyst',
          content: 'Escalating case to Fraud Investigation Team due to continued suspicious activity and inability to reach customer.'
        }
      ],
      documents: []
    },
    {
      id: 'CASE-005',
      title: 'Pattern Match Investigation',
      created_at: '2023-03-24 10:30:15',
      updated_at: '2023-03-28 15:45:22',
      status: 'closed',
      priority: 'medium',
      assigned_to: 'Robert Analyst',
      created_by: 'System',
      customer: {
        id: 'CUST-12349',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        phone: '+1 (555) 567-8901'
      },
      related_alerts: [
        { id: 'ALERT-005', type: 'pattern', timestamp: '2023-03-24 10:30:15' }
      ],
      related_transactions: [
        { 
          id: 'TRX-45682', 
          timestamp: '2023-03-24 10:30:15', 
          amount: 75.25, 
          currency: 'USD', 
          type: 'online_purchase',
          status: 'completed'
        },
        { 
          id: 'TRX-45683', 
          timestamp: '2023-03-24 15:45:22', 
          amount: 850.00, 
          currency: 'USD', 
          type: 'in_store_purchase',
          status: 'completed'
        }
      ],
      notes: [
        {
          id: 'NOTE-015',
          timestamp: '2023-03-24 10:30:15',
          author: 'System',
          content: 'Case automatically created from Alert ALERT-005'
        },
        {
          id: 'NOTE-016',
          timestamp: '2023-03-24 13:45:22',
          author: 'Robert Analyst',
          content: 'Transaction matches pattern ID FP-123: Small online purchase followed by larger in-store purchases within 24 hours.'
        },
        {
          id: 'NOTE-017',
          timestamp: '2023-03-25 09:15:33',
          author: 'Robert Analyst',
          content: 'Contacted customer who confirmed all transactions. Customer was traveling and making purchases in different locations.'
        },
        {
          id: 'NOTE-018',
          timestamp: '2023-03-28 15:45:22',
          author: 'Robert Analyst',
          content: 'Case resolved as false positive. Customer travel pattern verified.'
        }
      ],
      documents: [
        {
          id: 'DOC-004',
          name: 'Customer Verification',
          type: 'pdf',
          uploaded_at: '2023-03-25 10:30:45',
          uploaded_by: 'Robert Analyst'
        }
      ],
      resolution: {
        timestamp: '2023-03-28 15:45:22',
        resolved_by: 'Robert Analyst',
        resolution_type: 'false_positive',
        reason: 'Legitimate customer activity',
        actions_taken: 'Customer profile updated with travel information'
      }
    }
  ];
  
  // Filter cases based on active tab and search term
  const filteredCases = cases.filter(caseItem => {
    const matchesTab = 
      (activeTab === 'open' && caseItem.status === 'open') ||
      (activeTab === 'in_progress' && caseItem.status === 'in_progress') ||
      (activeTab === 'escalated' && caseItem.status === 'escalated') ||
      (activeTab === 'closed' && caseItem.status === 'closed') ||
      (activeTab === 'high_priority' && caseItem.priority === 'high') ||
      (activeTab === 'all');
    
    const matchesSearch = 
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue, bValue;
    
    // Handle nested fields
    if (sortField === 'customer.name') {
      aValue = a.customer.name;
      bValue = b.customer.name;
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
  
  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
    setActiveDetailTab('overview');
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge-warning';
      case 'in_progress': return 'badge-info';
      case 'escalated': return 'badge-danger';
      case 'closed': return 'badge-success';
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
  
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };
  
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };
  
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'zip': return '🗂️';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };
  
  return (
    <div className="case-management">
      <div className="page-header">
        <h1>Case Management</h1>
      </div>
      
      <div className="case-tabs">
        <div 
          className={`case-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Cases
        </div>
        <div 
          className={`case-tab ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          Open
        </div>
        <div 
          className={`case-tab ${activeTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress
        </div>
        <div 
          className={`case-tab ${activeTab === 'escalated' ? 'active' : ''}`}
          onClick={() => setActiveTab('escalated')}
        >
          Escalated
        </div>
        <div 
          className={`case-tab ${activeTab === 'closed' ? 'active' : ''}`}
          onClick={() => setActiveTab('closed')}
        >
          Closed
        </div>
        <div 
          className={`case-tab ${activeTab === 'high_priority' ? 'active' : ''}`}
          onClick={() => setActiveTab('high_priority')}
        >
          Hig
(Content truncated due to size limit. Use line ranges to read in chunks)