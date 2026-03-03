import React, { useState } from 'react';
import './CompliancePortal.css';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown, FaFileAlt, FaUserEdit, FaComments } from 'react-icons/fa';

const CompliancePortal = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  
  // Sample data for AML cases
  const amlCases = [
    {
      id: 'AML-001',
      title: 'Suspicious Transaction Pattern',
      created_at: '2023-03-28 09:15:22',
      updated_at: '2023-03-30 14:25:36',
      status: 'open',
      risk_level: 'high',
      assigned_to: 'John Compliance',
      created_by: 'System',
      customer: {
        id: 'CUST-12345',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        kyc_status: 'verified',
        customer_since: '2020-05-15'
      },
      related_transactions: [
        { 
          id: 'TRX-45678', 
          timestamp: '2023-03-28 09:14:36', 
          amount: 9500.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed',
          destination: 'Bank of America',
          destination_account: '****5678'
        },
        { 
          id: 'TRX-45679', 
          timestamp: '2023-03-27 10:22:15', 
          amount: 9200.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed',
          destination: 'Chase Bank',
          destination_account: '****3456'
        },
        { 
          id: 'TRX-45680', 
          timestamp: '2023-03-26 11:45:33', 
          amount: 9800.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed',
          destination: 'Wells Fargo',
          destination_account: '****7890'
        }
      ],
      notes: [
        {
          id: 'NOTE-001',
          timestamp: '2023-03-28 09:15:22',
          author: 'System',
          content: 'Case automatically created due to structured transactions pattern detection.'
        },
        {
          id: 'NOTE-002',
          timestamp: '2023-03-28 10:30:15',
          author: 'John Compliance',
          content: 'Customer has made multiple wire transfers just under the $10,000 reporting threshold. This appears to be potential structuring activity.'
        },
        {
          id: 'NOTE-003',
          timestamp: '2023-03-30 14:25:36',
          author: 'John Compliance',
          content: 'Attempted to contact customer for additional information about the purpose of these transfers. Left voicemail.'
        }
      ],
      documents: [
        {
          id: 'DOC-001',
          name: 'Transaction History',
          type: 'pdf',
          uploaded_at: '2023-03-28 11:45:22',
          uploaded_by: 'John Compliance'
        }
      ],
      alerts: [
        {
          id: 'ALERT-001',
          timestamp: '2023-03-28 09:15:22',
          type: 'structuring',
          description: 'Multiple transactions just below reporting threshold'
        }
      ]
    },
    {
      id: 'AML-002',
      title: 'High-Risk Country Transfer',
      created_at: '2023-03-27 14:22:45',
      updated_at: '2023-03-29 16:30:12',
      status: 'in_progress',
      risk_level: 'medium',
      assigned_to: 'Sarah Compliance',
      created_by: 'System',
      customer: {
        id: 'CUST-12348',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1 (555) 456-7890',
        kyc_status: 'verified',
        customer_since: '2019-11-20'
      },
      related_transactions: [
        { 
          id: 'TRX-45681', 
          timestamp: '2023-03-27 14:20:52', 
          amount: 15000.00, 
          currency: 'USD', 
          type: 'international_wire',
          status: 'completed',
          destination: 'Bank of Cyprus',
          destination_account: '****4321',
          destination_country: 'Cyprus'
        }
      ],
      notes: [
        {
          id: 'NOTE-004',
          timestamp: '2023-03-27 14:22:45',
          author: 'System',
          content: 'Case automatically created due to transfer to high-risk jurisdiction.'
        },
        {
          id: 'NOTE-005',
          timestamp: '2023-03-28 09:15:22',
          author: 'Sarah Compliance',
          content: 'Customer has sent funds to Cyprus, which is on our enhanced due diligence list. Need to verify purpose of transfer.'
        },
        {
          id: 'NOTE-006',
          timestamp: '2023-03-29 16:30:12',
          author: 'Sarah Compliance',
          content: 'Contacted customer who stated the transfer is for property purchase. Requested supporting documentation.'
        }
      ],
      documents: [],
      alerts: [
        {
          id: 'ALERT-002',
          timestamp: '2023-03-27 14:22:45',
          type: 'high_risk_country',
          description: 'Transfer to high-risk jurisdiction (Cyprus)'
        }
      ]
    },
    {
      id: 'AML-003',
      title: 'Politically Exposed Person Review',
      created_at: '2023-03-26 11:05:33',
      updated_at: '2023-03-30 10:45:18',
      status: 'closed',
      risk_level: 'high',
      assigned_to: 'Michael Compliance',
      created_by: 'System',
      customer: {
        id: 'CUST-12347',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 345-6789',
        kyc_status: 'enhanced_due_diligence',
        customer_since: '2021-02-10'
      },
      related_transactions: [
        { 
          id: 'TRX-45670', 
          timestamp: '2023-03-26 08:14:36', 
          amount: 50000.00, 
          currency: 'USD', 
          type: 'deposit',
          status: 'completed',
          source: 'Bank of Switzerland',
          source_account: '****9876'
        }
      ],
      notes: [
        {
          id: 'NOTE-007',
          timestamp: '2023-03-26 11:05:33',
          author: 'System',
          content: 'Case automatically created for PEP customer activity review.'
        },
        {
          id: 'NOTE-008',
          timestamp: '2023-03-26 13:45:22',
          author: 'Michael Compliance',
          content: 'Customer is flagged as a PEP (local government official). Large deposit received from Swiss bank account. Need to verify source of funds.'
        },
        {
          id: 'NOTE-009',
          timestamp: '2023-03-27 10:15:33',
          author: 'Michael Compliance',
          content: 'Contacted customer who provided documentation showing the funds are from sale of property. Documentation appears legitimate.'
        },
        {
          id: 'NOTE-010',
          timestamp: '2023-03-30 10:45:18',
          author: 'Michael Compliance',
          content: 'Reviewed all documentation and verified with property records. Transaction appears legitimate. Closing case but will continue enhanced monitoring of account.'
        }
      ],
      documents: [
        {
          id: 'DOC-002',
          name: 'Property Sale Contract',
          type: 'pdf',
          uploaded_at: '2023-03-27 11:30:45',
          uploaded_by: 'Michael Compliance'
        },
        {
          id: 'DOC-003',
          name: 'Source of Funds Declaration',
          type: 'pdf',
          uploaded_at: '2023-03-27 11:35:22',
          uploaded_by: 'Michael Compliance'
        }
      ],
      alerts: [
        {
          id: 'ALERT-003',
          timestamp: '2023-03-26 11:05:33',
          type: 'pep_activity',
          description: 'Large deposit to PEP customer account'
        }
      ],
      resolution: {
        timestamp: '2023-03-30 10:45:18',
        resolved_by: 'Michael Compliance',
        resolution_type: 'cleared',
        reason: 'Legitimate source of funds verified',
        actions_taken: 'Enhanced monitoring to continue',
        sar_filed: false
      }
    },
    {
      id: 'AML-004',
      title: 'Unusual Transaction Activity',
      created_at: '2023-03-25 16:45:12',
      updated_at: '2023-03-29 09:30:45',
      status: 'sar_filed',
      risk_level: 'high',
      assigned_to: 'Jane Compliance',
      created_by: 'System',
      customer: {
        id: 'CUST-12350',
        name: 'Thomas Wilson',
        email: 'thomas.wilson@example.com',
        phone: '+1 (555) 678-9012',
        kyc_status: 'verified',
        customer_since: '2018-07-22'
      },
      related_transactions: [
        { 
          id: 'TRX-45690', 
          timestamp: '2023-03-25 16:42:36', 
          amount: 25000.00, 
          currency: 'USD', 
          type: 'deposit',
          status: 'completed',
          source: 'Cash'
        },
        { 
          id: 'TRX-45691', 
          timestamp: '2023-03-25 17:15:22', 
          amount: 24000.00, 
          currency: 'USD', 
          type: 'wire_transfer',
          status: 'completed',
          destination: 'Bank of Cayman Islands',
          destination_account: '****1234'
        }
      ],
      notes: [
        {
          id: 'NOTE-011',
          timestamp: '2023-03-25 16:45:12',
          author: 'System',
          content: 'Case automatically created due to unusual transaction pattern.'
        },
        {
          id: 'NOTE-012',
          timestamp: '2023-03-26 09:30:22',
          author: 'Jane Compliance',
          content: 'Customer made large cash deposit followed by wire transfer to Cayman Islands. Customer\'s stated business does not typically involve cash transactions of this size.'
        },
        {
          id: 'NOTE-013',
          timestamp: '2023-03-27 14:15:33',
          author: 'Jane Compliance',
          content: 'Attempted to contact customer for explanation. Customer provided vague responses about "business opportunity" but could not provide specific details or documentation.'
        },
        {
          id: 'NOTE-014',
          timestamp: '2023-03-29 09:30:45',
          author: 'Jane Compliance',
          content: 'After review with compliance team, decision made to file SAR due to suspicious nature of transactions and lack of satisfactory explanation.'
        }
      ],
      documents: [
        {
          id: 'DOC-004',
          name: 'SAR Filing Confirmation',
          type: 'pdf',
          uploaded_at: '2023-03-29 09:35:22',
          uploaded_by: 'Jane Compliance'
        }
      ],
      alerts: [
        {
          id: 'ALERT-004',
          timestamp: '2023-03-25 16:45:12',
          type: 'unusual_pattern',
          description: 'Large cash deposit followed by international wire transfer'
        }
      ],
      resolution: {
        timestamp: '2023-03-29 09:30:45',
        resolved_by: 'Jane Compliance',
        resolution_type: 'sar_filed',
        reason: 'Suspicious activity with inadequate explanation',
        actions_taken: 'SAR filed with FinCEN',
        sar_filed: true,
        sar_reference: 'SAR-2023-45678'
      }
    },
    {
      id: 'AML-005',
      title: 'Negative News Review',
      created_at: '2023-03-24 10:30:15',
      updated_at: '2023-03-28 15:45:22',
      status: 'escalated',
      risk_level: 'high',
      assigned_to: 'Robert Compliance',
      created_by: 'System',
      customer: {
        id: 'CUST-12349',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        phone: '+1 (555) 567-8901',
        kyc_status: 'verified',
        customer_since: '2019-03-15'
      },
      related_transactions: [
        { 
          id: 'TRX-45682', 
          timestamp: '2023-03-24 10:30:15', 
          amount: 75000.00, 
          currency: 'USD', 
          type: 'incoming_wire',
          status: 'completed',
          source: 'First National Bank',
          source_account: '****5678'
        }
      ],
      notes: [
        {
          id: 'NOTE-015',
          timestamp: '2023-03-24 10:30:15',
          author: 'System',
          content: 'Case automatically created due to negative news alert.'
        },
        {
          id: 'NOTE-016',
          timestamp: '2023-03-24 13:45:22',
          author: 'Robert Compliance',
          content: 'Customer has been mentioned in news articles regarding potential involvement in corporate fraud investigation. Need to assess impact and risk.'
        },
        {
          id: 'NOTE-017',
          timestamp: '2023-03-25 09:15:33',
          author: 'Robert Compliance',
          content: 'Reviewed news sources and confirmed customer is under investigation by SEC. Recent large incoming wire increases risk profile.'
        },
        {
          id: 'NOTE-018',
          timestamp: '2023-03-28 15:45:22',
          author: 'Robert Compliance',
          content: 'Escalating case to senior compliance team and legal department for review and determination of appropriate action.'
        }
      ],
      documents: [
        {
          id: 'DOC-005',
          name: 'News Article Compilation',
          type: 'pdf',
          uploaded_at: '2023-03-24 14:30:45',
          uploaded_by: 'Robert Compliance'
        },
        {
          id: 'DOC-006',
          name: 'Risk Assessment Report',
          type: 'pdf',
          uploaded_at: '2023-03-28 15:30:22',
          uploaded_by: 'Robert Compliance'
        }
      ],
      alerts: [
        {
          id: 'ALERT-005',
          timestamp: '2023-03-24 10:30:15',
          type: 'negative_news',
          description: 'Customer mentioned in fraud investigation news'
        }
      ]
    }
  ];
  
  // Filter cases based on active tab and search term
  const filteredCases = amlCases.filter(caseItem => {
    const matchesTab = 
      (activeTab === 'open' && caseItem.status === 'open') ||
      (activeTab === 'in_progress' && caseItem.status === 'in_progress') ||
      (activeTab === 'escalated' && caseItem.status === 'escalated') ||
      (activeTab === 'sar_filed' && caseItem.status === 'sar_filed') ||
      (activeTab === 'closed' && caseItem.status === 'closed') ||
      (activeTab === 'high_risk' && caseItem.risk_level === 'high') ||
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
      case 'in_progress': return 'badge-info
(Content truncated due to size limit. Use line ranges to read in chunks)