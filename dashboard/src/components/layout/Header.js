import React, { useState } from 'react';
import { Bell, RefreshCw, Clock, ChevronDown, Circle } from 'lucide-react';

const pageNames = {
  dashboard: 'Executive Dashboard',
  transactions: 'Transaction Monitoring',
  alerts: 'Alert Management',
  cases: 'Case Management',
  rules: 'Rule Management',
  aml: 'AML / Compliance',
  'ml-models': 'ML Models & Analytics',
  reports: 'Reports & Analytics',
  admin: 'System Administration',
};

const Header = ({ activePage }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'white',
      borderBottom: '1px solid var(--slate-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
          {pageNames[activePage] || 'Dashboard'}
        </h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', borderRadius: 'var(--radius-sm)',
          background: 'var(--success-50)', border: '1px solid var(--success-100)',
        }}>
          <Circle size={8} fill="var(--success-500)" color="var(--success-500)" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success-700)' }}>Live</span>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Last updated */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: 'var(--radius-sm)',
          color: 'var(--slate-500)', fontSize: '12px',
        }}>
          <Clock size={14} />
          <span>Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Refresh button */}
        <button
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--slate-200)', background: 'white',
            cursor: 'pointer', color: 'var(--slate-500)',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.color = 'var(--slate-700)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--slate-500)'; }}
          title="Refresh data"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)', background: 'white',
              cursor: 'pointer', color: 'var(--slate-500)',
              transition: 'var(--transition-fast)', position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
          >
            <Bell size={15} />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--danger-500)',
              border: '2px solid white',
            }} />
          </button>
          {showNotifications && (
            <div style={{
              position: 'absolute', top: '100%', right: 0,
              marginTop: '8px', width: '360px',
              background: 'white', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)',
              overflow: 'hidden', zIndex: 1000,
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
              </div>
              {[
                { title: 'Critical: Rapid transaction burst', desc: 'Card ending 8821 - 15 txns in 2 min', time: '3m ago', severity: 'critical' },
                { title: 'SAR Filed: AML-2044', desc: 'Ahmad Hassan structuring case', time: '15m ago', severity: 'high' },
                { title: 'ML Model deployed', desc: 'Fraud Classifier v3.3-beta in A/B testing', time: '1h ago', severity: 'info' },
                { title: 'Rule accuracy drop', desc: 'RULE-008 MCC Mismatch below threshold', time: '2h ago', severity: 'warning' },
              ].map((n, i) => (
                <div key={i} style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--slate-50)',
                  cursor: 'pointer', transition: 'var(--transition-fast)',
                  display: 'flex', gap: '12px',
                }} onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.severity === 'critical' ? 'var(--danger-500)' : n.severity === 'high' ? 'var(--warning-500)' : n.severity === 'warning' ? 'var(--warning-500)' : 'var(--primary-500)',
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--slate-800)' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Environment badge */}
        <div style={{
          padding: '4px 10px', borderRadius: 'var(--radius-sm)',
          background: 'var(--warning-50)', border: '1px solid var(--warning-100)',
          fontSize: '11px', fontWeight: 600, color: 'var(--warning-600)',
          letterSpacing: '0.02em',
        }}>
          STAGING
        </div>
      </div>
    </header>
  );
};

export default Header;
