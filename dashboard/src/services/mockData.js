// Comprehensive mock data for the Enterprise Fraud Detection & AML Dashboard

export const kpiData = {
  totalTransactions: { value: 2847563, change: 12.4, period: 'vs last month' },
  fraudDetected: { value: 3241, change: -8.2, period: 'vs last month' },
  fraudRate: { value: 0.114, change: -18.6, period: 'vs last month' },
  totalVolume: { value: 847200000, change: 15.3, period: 'vs last month' },
  blockedAmount: { value: 12450000, change: -5.7, period: 'vs last month' },
  activeAlerts: { value: 187, change: -12.1, period: 'vs last month' },
  openCases: { value: 43, change: 2.4, period: 'vs last month' },
  systemUptime: { value: 99.97, change: 0.02, period: 'vs last month' },
  avgResponseTime: { value: 23, change: -15.2, period: 'vs last month' },
  falsePositiveRate: { value: 3.2, change: -22.0, period: 'vs last month' },
  ruleAccuracy: { value: 96.8, change: 1.2, period: 'vs last month' },
  mlModelAccuracy: { value: 98.4, change: 0.8, period: 'vs last month' },
};

export const transactionVolumeData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  approved: [2.1, 2.3, 2.5, 2.4, 2.6, 2.8, 2.7, 2.9, 3.0, 2.8, 2.9, 2.85],
  declined: [0.08, 0.07, 0.09, 0.06, 0.07, 0.08, 0.05, 0.06, 0.07, 0.05, 0.04, 0.03],
  flagged: [0.12, 0.11, 0.13, 0.10, 0.11, 0.12, 0.09, 0.10, 0.11, 0.09, 0.08, 0.07],
};

export const fraudByTypeData = {
  labels: ['Card Not Present', 'Account Takeover', 'Identity Theft', 'Card Testing', 'Friendly Fraud', 'Merchant Fraud'],
  values: [34, 22, 18, 12, 9, 5],
  colors: ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981'],
};

export const fraudByChannelData = {
  labels: ['E-commerce', 'POS', 'ATM', 'Mobile', 'Wire Transfer', 'ACH'],
  values: [42, 18, 12, 15, 8, 5],
};

export const geoFraudData = [
  { country: 'United States', transactions: 1245000, fraudRate: 0.09, amount: '$2.4M' },
  { country: 'United Kingdom', transactions: 456000, fraudRate: 0.12, amount: '$890K' },
  { country: 'Germany', transactions: 234000, fraudRate: 0.08, amount: '$420K' },
  { country: 'Nigeria', transactions: 34000, fraudRate: 2.34, amount: '$1.2M' },
  { country: 'Brazil', transactions: 189000, fraudRate: 0.45, amount: '$670K' },
  { country: 'India', transactions: 312000, fraudRate: 0.18, amount: '$340K' },
  { country: 'China', transactions: 267000, fraudRate: 0.15, amount: '$290K' },
  { country: 'Russia', transactions: 45000, fraudRate: 1.87, amount: '$980K' },
];

export const hourlyTransactionData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  legitimate: [12, 8, 5, 3, 4, 8, 15, 35, 52, 68, 72, 78, 82, 75, 70, 65, 58, 55, 48, 42, 38, 30, 22, 16],
  fraudulent: [2, 3, 4, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 3, 2],
};

export const recentTransactions = [
  { id: 'TXN-2847563', timestamp: '2026-03-03T14:23:45Z', amount: 2450.00, currency: 'USD', merchant: 'Amazon.com', type: 'E-commerce', status: 'approved', riskScore: 12, cardLast4: '4532', country: 'US' },
  { id: 'TXN-2847562', timestamp: '2026-03-03T14:22:18Z', amount: 15780.00, currency: 'USD', merchant: 'Wire Transfer - Offshore', type: 'Wire', status: 'blocked', riskScore: 94, cardLast4: '8821', country: 'NG' },
  { id: 'TXN-2847561', timestamp: '2026-03-03T14:21:33Z', amount: 89.99, currency: 'EUR', merchant: 'Netflix EU', type: 'Subscription', status: 'approved', riskScore: 3, cardLast4: '1156', country: 'DE' },
  { id: 'TXN-2847560', timestamp: '2026-03-03T14:20:55Z', amount: 4500.00, currency: 'USD', merchant: 'BestBuy.com', type: 'E-commerce', status: 'review', riskScore: 67, cardLast4: '7743', country: 'US' },
  { id: 'TXN-2847559', timestamp: '2026-03-03T14:19:12Z', amount: 125.50, currency: 'GBP', merchant: 'Tesco PLC', type: 'POS', status: 'approved', riskScore: 5, cardLast4: '2289', country: 'GB' },
  { id: 'TXN-2847558', timestamp: '2026-03-03T14:18:44Z', amount: 9999.99, currency: 'USD', merchant: 'Unknown Merchant', type: 'CNP', status: 'blocked', riskScore: 98, cardLast4: '6614', country: 'RU' },
  { id: 'TXN-2847557', timestamp: '2026-03-03T14:17:20Z', amount: 45.00, currency: 'USD', merchant: 'Uber Technologies', type: 'Mobile', status: 'approved', riskScore: 8, cardLast4: '3390', country: 'US' },
  { id: 'TXN-2847556', timestamp: '2026-03-03T14:16:08Z', amount: 7800.00, currency: 'USD', merchant: 'Rapid Transfer Co', type: 'Wire', status: 'review', riskScore: 73, cardLast4: '5501', country: 'BR' },
  { id: 'TXN-2847555', timestamp: '2026-03-03T14:15:33Z', amount: 320.00, currency: 'CAD', merchant: 'Shopify Store', type: 'E-commerce', status: 'approved', riskScore: 15, cardLast4: '9912', country: 'CA' },
  { id: 'TXN-2847554', timestamp: '2026-03-03T14:14:22Z', amount: 0.01, currency: 'USD', merchant: 'Test Transaction', type: 'CNP', status: 'blocked', riskScore: 99, cardLast4: '1100', country: 'UA' },
];

export const alerts = [
  { id: 'ALT-1087', timestamp: '2026-03-03T14:20:00Z', type: 'Velocity', severity: 'critical', title: 'Rapid successive transactions detected', description: '15 transactions in 2 minutes from card ending 8821', status: 'open', assignee: 'Sarah Chen', riskScore: 95 },
  { id: 'ALT-1086', timestamp: '2026-03-03T14:15:00Z', type: 'Amount', severity: 'high', title: 'Unusual high-value transfer', description: '$15,780 wire transfer to Nigeria from new account', status: 'investigating', assignee: 'James Wilson', riskScore: 88 },
  { id: 'ALT-1085', timestamp: '2026-03-03T14:10:00Z', type: 'Geo', severity: 'high', title: 'Impossible travel detected', description: 'Transaction in UK 30 min after US transaction', status: 'open', assignee: null, riskScore: 82 },
  { id: 'ALT-1084', timestamp: '2026-03-03T14:05:00Z', type: 'Pattern', severity: 'medium', title: 'Card testing pattern', description: 'Multiple small transactions ($0.01-$1.00) on card 1100', status: 'investigating', assignee: 'Maria Garcia', riskScore: 76 },
  { id: 'ALT-1083', timestamp: '2026-03-03T13:55:00Z', type: 'ML', severity: 'medium', title: 'Anomalous spending behavior', description: 'Account 44521 deviating from typical pattern by 340%', status: 'open', assignee: null, riskScore: 71 },
  { id: 'ALT-1082', timestamp: '2026-03-03T13:45:00Z', type: 'AML', severity: 'critical', title: 'Potential structuring detected', description: 'Multiple deposits just under $10K threshold', status: 'escalated', assignee: 'Robert Kim', riskScore: 92 },
  { id: 'ALT-1081', timestamp: '2026-03-03T13:30:00Z', type: 'Rule', severity: 'low', title: 'MCC mismatch', description: 'Merchant category does not match transaction type', status: 'closed', assignee: 'Sarah Chen', riskScore: 35 },
  { id: 'ALT-1080', timestamp: '2026-03-03T13:15:00Z', type: 'Velocity', severity: 'high', title: 'Burst transaction pattern', description: '8 e-commerce transactions across 5 merchants in 10 min', status: 'investigating', assignee: 'James Wilson', riskScore: 84 },
];

export const cases = [
  { id: 'CASE-0043', title: 'Organized Card Testing Ring', type: 'Card Testing', status: 'active', priority: 'critical', assignee: 'Sarah Chen', created: '2026-02-28', alerts: 12, transactions: 847, amount: '$23,450', lastUpdate: '2 hours ago' },
  { id: 'CASE-0042', title: 'Potential Money Laundering - Shell Co', type: 'AML', status: 'active', priority: 'critical', assignee: 'Robert Kim', created: '2026-02-25', alerts: 8, transactions: 234, amount: '$1,245,000', lastUpdate: '4 hours ago' },
  { id: 'CASE-0041', title: 'Account Takeover Cluster', type: 'Account Takeover', status: 'active', priority: 'high', assignee: 'James Wilson', created: '2026-02-27', alerts: 15, transactions: 56, amount: '$89,200', lastUpdate: '1 hour ago' },
  { id: 'CASE-0040', title: 'Cross-Border Structuring Pattern', type: 'AML', status: 'review', priority: 'high', assignee: 'Maria Garcia', created: '2026-02-20', alerts: 6, transactions: 178, amount: '$567,000', lastUpdate: '6 hours ago' },
  { id: 'CASE-0039', title: 'Merchant Collusion Investigation', type: 'Merchant Fraud', status: 'active', priority: 'medium', assignee: 'Sarah Chen', created: '2026-02-18', alerts: 4, transactions: 1234, amount: '$456,000', lastUpdate: '1 day ago' },
  { id: 'CASE-0038', title: 'Stolen Identity Ring', type: 'Identity Theft', status: 'pending_review', priority: 'high', assignee: 'James Wilson', created: '2026-02-15', alerts: 9, transactions: 67, amount: '$34,500', lastUpdate: '2 days ago' },
];

export const rules = [
  { id: 'RULE-001', name: 'High Value Transaction Block', type: 'Amount', status: 'active', triggers: 1245, accuracy: 97.2, falsePositives: 34, lastModified: '2026-02-15', priority: 1 },
  { id: 'RULE-002', name: 'Velocity Check - 5 min window', type: 'Velocity', status: 'active', triggers: 3456, accuracy: 94.8, falsePositives: 178, lastModified: '2026-02-20', priority: 1 },
  { id: 'RULE-003', name: 'Geo-Impossible Travel', type: 'Geographical', status: 'active', triggers: 892, accuracy: 98.1, falsePositives: 17, lastModified: '2026-01-30', priority: 2 },
  { id: 'RULE-004', name: 'Card Testing Detection', type: 'Pattern', status: 'active', triggers: 567, accuracy: 96.5, falsePositives: 20, lastModified: '2026-02-10', priority: 1 },
  { id: 'RULE-005', name: 'High Risk Country Block', type: 'Geographical', status: 'active', triggers: 2341, accuracy: 92.3, falsePositives: 180, lastModified: '2026-02-25', priority: 2 },
  { id: 'RULE-006', name: 'Night Hours Threshold', type: 'Behavioral', status: 'testing', triggers: 234, accuracy: 88.7, falsePositives: 26, lastModified: '2026-03-01', priority: 3 },
  { id: 'RULE-007', name: 'New Account Large Transaction', type: 'Combination', status: 'active', triggers: 456, accuracy: 95.9, falsePositives: 19, lastModified: '2026-02-05', priority: 1 },
  { id: 'RULE-008', name: 'MCC Mismatch Detection', type: 'Merchant', status: 'inactive', triggers: 123, accuracy: 78.4, falsePositives: 27, lastModified: '2026-01-15', priority: 3 },
];

export const amlCases = [
  { id: 'AML-2045', entity: 'Pacific Trading Ltd', type: 'Shell Company', riskLevel: 'critical', status: 'investigating', country: 'Cayman Islands', amount: '$4,567,000', sarFiled: false, assignee: 'Robert Kim', created: '2026-02-20' },
  { id: 'AML-2044', entity: 'Ahmad Hassan', type: 'Structuring', riskLevel: 'high', status: 'sar_filed', country: 'UAE', amount: '$890,000', sarFiled: true, assignee: 'Maria Garcia', created: '2026-02-15' },
  { id: 'AML-2043', entity: 'Eastern Imports Co', type: 'Layering', riskLevel: 'high', status: 'investigating', country: 'Hong Kong', amount: '$2,340,000', sarFiled: false, assignee: 'Robert Kim', created: '2026-02-10' },
  { id: 'AML-2042', entity: 'Viktor Petrov', type: 'PEP', riskLevel: 'medium', status: 'monitoring', country: 'Russia', amount: '$567,000', sarFiled: false, assignee: 'Maria Garcia', created: '2026-01-28' },
  { id: 'AML-2041', entity: 'Global Ventures LLC', type: 'High Risk Country', riskLevel: 'high', status: 'escalated', country: 'Iran', amount: '$1,200,000', sarFiled: true, assignee: 'Robert Kim', created: '2026-01-20' },
];

export const mlModels = [
  { id: 'MDL-001', name: 'Fraud Classifier v3.2', type: 'Classification', status: 'production', accuracy: 98.4, precision: 97.8, recall: 96.2, f1Score: 97.0, auc: 99.1, lastTrained: '2026-02-28', predictions: 2847563 },
  { id: 'MDL-002', name: 'Anomaly Detector v2.1', type: 'Anomaly Detection', status: 'production', accuracy: 96.7, precision: 94.3, recall: 98.1, f1Score: 96.2, auc: 97.8, lastTrained: '2026-02-25', predictions: 2847563 },
  { id: 'MDL-003', name: 'Behavioral Analyzer v1.8', type: 'Behavioral', status: 'production', accuracy: 95.2, precision: 93.1, recall: 94.8, f1Score: 93.9, auc: 96.5, lastTrained: '2026-02-20', predictions: 1423781 },
  { id: 'MDL-004', name: 'Network Analysis v1.3', type: 'Network', status: 'testing', accuracy: 92.8, precision: 90.5, recall: 93.4, f1Score: 91.9, auc: 95.2, lastTrained: '2026-03-01', predictions: 456000 },
  { id: 'MDL-005', name: 'Fraud Classifier v3.3-beta', type: 'Classification', status: 'a/b_testing', accuracy: 98.7, precision: 98.1, recall: 96.8, f1Score: 97.4, auc: 99.3, lastTrained: '2026-03-02', predictions: 284756 },
];

export const modelPerformanceHistory = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  accuracy: [97.8, 97.9, 98.0, 98.1, 98.2, 98.3, 98.3, 98.4],
  precision: [97.1, 97.2, 97.4, 97.5, 97.6, 97.7, 97.7, 97.8],
  recall: [95.4, 95.6, 95.8, 95.9, 96.0, 96.0, 96.1, 96.2],
  f1: [96.2, 96.4, 96.6, 96.7, 96.8, 96.8, 96.9, 97.0],
};

export const serviceHealth = [
  { name: 'API Gateway', status: 'healthy', uptime: 99.99, responseTime: 12, cpu: 23, memory: 45, requests: '12.4K/min' },
  { name: 'Transaction API', status: 'healthy', uptime: 99.98, responseTime: 18, cpu: 45, memory: 62, requests: '8.7K/min' },
  { name: 'Signal Service', status: 'healthy', uptime: 99.97, responseTime: 8, cpu: 34, memory: 51, requests: '24.1K/min' },
  { name: 'Rule Service', status: 'healthy', uptime: 99.99, responseTime: 15, cpu: 38, memory: 48, requests: '8.7K/min' },
  { name: 'ML Service', status: 'healthy', uptime: 99.95, responseTime: 45, cpu: 78, memory: 85, requests: '8.7K/min' },
  { name: 'Velocity Service', status: 'healthy', uptime: 99.98, responseTime: 11, cpu: 29, memory: 42, requests: '8.7K/min' },
  { name: 'Block Service', status: 'healthy', uptime: 99.99, responseTime: 5, cpu: 12, memory: 28, requests: '8.7K/min' },
  { name: 'AML Service', status: 'warning', uptime: 99.92, responseTime: 67, cpu: 82, memory: 89, requests: '2.1K/min' },
  { name: 'Response Service', status: 'healthy', uptime: 99.97, responseTime: 14, cpu: 31, memory: 44, requests: '8.7K/min' },
  { name: 'PostgreSQL', status: 'healthy', uptime: 99.99, responseTime: 3, cpu: 42, memory: 67, requests: '45.2K/min' },
  { name: 'Redis', status: 'healthy', uptime: 99.99, responseTime: 1, cpu: 18, memory: 54, requests: '89.3K/min' },
];

export const users = [
  { id: 'USR-001', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'fraud_analyst', department: 'Fraud Operations', status: 'active', lastLogin: '2026-03-03T14:00:00Z', casesResolved: 234 },
  { id: 'USR-002', name: 'James Wilson', email: 'james.wilson@company.com', role: 'fraud_analyst', department: 'Fraud Operations', status: 'active', lastLogin: '2026-03-03T13:45:00Z', casesResolved: 198 },
  { id: 'USR-003', name: 'Robert Kim', email: 'robert.kim@company.com', role: 'compliance_officer', department: 'Compliance', status: 'active', lastLogin: '2026-03-03T14:10:00Z', casesResolved: 156 },
  { id: 'USR-004', name: 'Maria Garcia', email: 'maria.garcia@company.com', role: 'compliance_officer', department: 'Compliance', status: 'active', lastLogin: '2026-03-03T12:30:00Z', casesResolved: 187 },
  { id: 'USR-005', name: 'David Park', email: 'david.park@company.com', role: 'risk_manager', department: 'Risk Management', status: 'active', lastLogin: '2026-03-03T11:00:00Z', casesResolved: 89 },
  { id: 'USR-006', name: 'Lisa Thompson', email: 'lisa.thompson@company.com', role: 'system_admin', department: 'IT', status: 'active', lastLogin: '2026-03-03T14:15:00Z', casesResolved: 0 },
  { id: 'USR-007', name: 'Michael Brown', email: 'michael.brown@company.com', role: 'data_analyst', department: 'Data Science', status: 'active', lastLogin: '2026-03-02T16:00:00Z', casesResolved: 45 },
  { id: 'USR-008', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'executive', department: 'Executive', status: 'active', lastLogin: '2026-03-03T09:00:00Z', casesResolved: 0 },
];

export const auditLogs = [
  { id: 1, timestamp: '2026-03-03T14:23:45Z', user: 'Sarah Chen', action: 'Updated alert ALT-1087 status to investigating', type: 'update', ip: '10.0.1.45' },
  { id: 2, timestamp: '2026-03-03T14:20:12Z', user: 'Robert Kim', action: 'Filed SAR for AML-2044', type: 'create', ip: '10.0.1.67' },
  { id: 3, timestamp: '2026-03-03T14:15:33Z', user: 'James Wilson', action: 'Blocked transaction TXN-2847562', type: 'action', ip: '10.0.1.45' },
  { id: 4, timestamp: '2026-03-03T14:10:22Z', user: 'Lisa Thompson', action: 'Modified Rule RULE-006 parameters', type: 'update', ip: '10.0.1.12' },
  { id: 5, timestamp: '2026-03-03T14:05:11Z', user: 'Maria Garcia', action: 'Escalated case CASE-0040', type: 'action', ip: '10.0.1.89' },
  { id: 6, timestamp: '2026-03-03T13:55:00Z', user: 'David Park', action: 'Approved rule change for RULE-002', type: 'approve', ip: '10.0.1.34' },
  { id: 7, timestamp: '2026-03-03T13:45:30Z', user: 'Michael Brown', action: 'Deployed ML model MDL-005 to A/B testing', type: 'deploy', ip: '10.0.1.56' },
  { id: 8, timestamp: '2026-03-03T13:30:15Z', user: 'Sarah Chen', action: 'Closed case CASE-0037 - confirmed fraud', type: 'close', ip: '10.0.1.45' },
];

export const riskDistribution = {
  labels: ['Very Low (0-20)', 'Low (21-40)', 'Medium (41-60)', 'High (61-80)', 'Critical (81-100)'],
  values: [68, 18, 8, 4, 2],
  colors: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444', '#991b1b'],
};

export const detectionMethodBreakdown = {
  labels: ['Rule Engine', 'ML Models', 'Velocity Checks', 'Block Lists', 'AML Screening', 'Manual Review'],
  values: [35, 28, 18, 10, 6, 3],
};

export const weeklyTrend = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  transactions: [420000, 445000, 438000, 452000, 460000, 380000, 252563],
  fraudAttempts: [480, 510, 490, 520, 505, 410, 326],
  blocked: [465, 498, 478, 508, 492, 398, 312],
};
