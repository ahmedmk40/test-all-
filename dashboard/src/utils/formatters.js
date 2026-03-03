export const formatCurrency = (amount, currency = 'USD') => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercent = (num) => `${num.toFixed(1)}%`;

export const formatTimestamp = (ts) => {
  const d = new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

export const formatTimeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const getRiskColor = (score) => {
  if (score >= 80) return 'var(--danger-600)';
  if (score >= 60) return 'var(--warning-600)';
  if (score >= 40) return 'var(--warning-500)';
  if (score >= 20) return 'var(--success-600)';
  return 'var(--success-500)';
};

export const getRiskBg = (score) => {
  if (score >= 80) return 'var(--danger-50)';
  if (score >= 60) return 'var(--warning-50)';
  if (score >= 40) return 'var(--warning-50)';
  return 'var(--success-50)';
};

export const getStatusColor = (status) => {
  const map = {
    approved: 'var(--success-600)',
    active: 'var(--success-600)',
    healthy: 'var(--success-600)',
    production: 'var(--success-600)',
    open: 'var(--primary-600)',
    investigating: 'var(--info-600)',
    monitoring: 'var(--info-600)',
    review: 'var(--warning-600)',
    pending_review: 'var(--warning-600)',
    testing: 'var(--warning-600)',
    'a/b_testing': 'var(--warning-600)',
    warning: 'var(--warning-600)',
    sar_filed: 'var(--warning-600)',
    escalated: 'var(--danger-600)',
    blocked: 'var(--danger-600)',
    critical: 'var(--danger-600)',
    closed: 'var(--slate-500)',
    inactive: 'var(--slate-500)',
  };
  return map[status] || 'var(--slate-500)';
};

export const getStatusBg = (status) => {
  const map = {
    approved: 'var(--success-50)',
    active: 'var(--success-50)',
    healthy: 'var(--success-50)',
    production: 'var(--success-50)',
    open: 'var(--primary-50)',
    investigating: 'var(--info-50)',
    monitoring: 'var(--info-50)',
    review: 'var(--warning-50)',
    pending_review: 'var(--warning-50)',
    testing: 'var(--warning-50)',
    'a/b_testing': 'var(--warning-50)',
    warning: 'var(--warning-50)',
    sar_filed: 'var(--warning-50)',
    escalated: 'var(--danger-50)',
    blocked: 'var(--danger-50)',
    critical: 'var(--danger-50)',
    closed: 'var(--slate-100)',
    inactive: 'var(--slate-100)',
  };
  return map[status] || 'var(--slate-100)';
};

export const getSeverityIcon = (severity) => {
  const map = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
  return map[severity] || '⚪';
};
