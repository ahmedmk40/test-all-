import React from 'react';
import { getStatusColor, getStatusBg } from '../../utils/formatters';

const Badge = ({ status, children, size = 'sm' }) => {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: size === 'sm' ? '2px 8px' : '4px 12px',
    borderRadius: '9999px',
    fontSize: size === 'sm' ? '11px' : '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    color: getStatusColor(status),
    backgroundColor: getStatusBg(status),
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  };

  return <span style={style}>{children || status.replace(/_/g, ' ')}</span>;
};

export default Badge;
