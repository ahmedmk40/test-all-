import React from 'react';

const KpiCard = ({ title, value, change, icon: Icon, color = 'var(--primary-600)', subtitle }) => {
  const isPositive = change > 0;
  const changeColor = title.toLowerCase().includes('fraud') || title.toLowerCase().includes('false') || title.toLowerCase().includes('alert')
    ? (isPositive ? 'var(--danger-600)' : 'var(--success-600)')
    : (isPositive ? 'var(--success-600)' : 'var(--danger-600)');

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--slate-200)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'var(--transition-base)',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.borderColor = 'var(--slate-300)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.borderColor = 'var(--slate-200)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: `${color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={18} color={color} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {change !== undefined && (
          <span style={{ fontSize: '12px', fontWeight: 600, color: changeColor, display: 'flex', alignItems: 'center', gap: '2px' }}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      {subtitle && (
        <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{subtitle}</span>
      )}
    </div>
  );
};

export default KpiCard;
