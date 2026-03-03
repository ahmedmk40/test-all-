import React, { useState } from 'react';
import { Users, Settings, Database, Shield, Clock, Server, Activity, Lock, Eye, Edit, Trash2, Plus } from 'lucide-react';
import Badge from '../components/common/Badge';
import { users, serviceHealth, auditLogs } from '../services/mockData';
import { formatTimestamp } from '../utils/formatters';

const roleLabels = {
  fraud_analyst: 'Fraud Analyst',
  compliance_officer: 'Compliance Officer',
  risk_manager: 'Risk Manager',
  system_admin: 'System Admin',
  data_analyst: 'Data Analyst',
  executive: 'Executive',
};

const Admin = () => {
  const [tab, setTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'audit', label: 'Audit Log', icon: Clock },
    { id: 'config', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--slate-100)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
            background: tab === t.id ? 'white' : 'transparent',
            cursor: 'pointer', fontSize: '13px', fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--slate-800)' : 'var(--slate-500)',
            boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
          }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>User Management ({users.length} users)</h3>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              background: 'var(--primary-600)', color: 'white', border: 'none',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            }}><Plus size={14} /> Add User</button>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                  {['User', 'Role', 'Department', 'Status', 'Last Login', 'Cases Resolved', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--slate-100)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 700, color: 'white',
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{user.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '9999px',
                        background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 500,
                      }}>{roleLabels[user.role]}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{user.department}</td>
                    <td style={{ padding: '12px 16px' }}><Badge status={user.status} /></td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--slate-500)' }}>{formatTimestamp(user.lastLogin)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontFamily: 'monospace' }}>{user.casesResolved}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[Eye, Edit, Lock].map((Icon, i) => (
                          <button key={i} style={{
                            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)',
                            background: 'white', cursor: 'pointer', color: 'var(--slate-500)',
                          }}>
                            <Icon size={13} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Services Tab */}
      {tab === 'services' && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Infrastructure Health</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
            {serviceHealth.map(svc => (
              <div key={svc.name} style={{
                background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px',
                border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: svc.status === 'healthy' ? 'var(--success-500)' : 'var(--warning-500)',
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{svc.name}</span>
                  </div>
                  <Badge status={svc.status === 'healthy' ? 'active' : 'warning'}>{svc.status}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Uptime', value: `${svc.uptime}%` },
                    { label: 'Response', value: `${svc.responseTime}ms` },
                    { label: 'CPU', value: `${svc.cpu}%`, bar: true, barVal: svc.cpu },
                    { label: 'Memory', value: `${svc.memory}%`, bar: true, barVal: svc.memory },
                  ].map(metric => (
                    <div key={metric.label}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{metric.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{metric.value}</div>
                      {metric.bar && (
                        <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--slate-100)', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${metric.barVal}%`, height: '100%', borderRadius: 2,
                            background: metric.barVal > 80 ? 'var(--danger-500)' : metric.barVal > 60 ? 'var(--warning-500)' : 'var(--success-500)',
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--slate-400)' }}>Requests: {svc.requests}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Audit Log Tab */}
      {tab === 'audit' && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Activity Audit Log</h3>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                  {['Timestamp', 'User', 'Action', 'Type', 'IP Address'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--slate-100)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-500)' }}>{formatTimestamp(log.timestamp)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{log.user}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{log.action}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 500,
                        background: log.type === 'action' ? 'var(--primary-50)' : log.type === 'create' ? 'var(--success-50)' : log.type === 'approve' ? 'var(--info-50)' : log.type === 'deploy' ? 'var(--warning-50)' : 'var(--slate-100)',
                        color: log.type === 'action' ? 'var(--primary-700)' : log.type === 'create' ? 'var(--success-700)' : log.type === 'approve' ? 'var(--info-600)' : log.type === 'deploy' ? 'var(--warning-700)' : 'var(--slate-600)',
                      }}>{log.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-500)' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Configuration Tab */}
      {tab === 'config' && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>System Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              {
                title: 'Security Settings', icon: Shield, items: [
                  { key: 'Session Timeout', value: '30 minutes' },
                  { key: 'Max Login Attempts', value: '5' },
                  { key: 'Password Policy', value: 'Strong (12+ chars)' },
                  { key: 'Two-Factor Auth', value: 'Required for all' },
                  { key: 'IP Whitelist', value: 'Enabled (12 IPs)' },
                ],
              },
              {
                title: 'Processing Limits', icon: Activity, items: [
                  { key: 'Max Transaction Amount', value: '$50,000' },
                  { key: 'Daily Volume Limit', value: '$10,000,000' },
                  { key: 'Rate Limit', value: '1000 req/min' },
                  { key: 'Auto-Block Threshold', value: 'Risk Score > 90' },
                  { key: 'Review Threshold', value: 'Risk Score > 60' },
                ],
              },
              {
                title: 'Database Settings', icon: Database, items: [
                  { key: 'Primary DB', value: 'PostgreSQL 14.9' },
                  { key: 'Cache', value: 'Redis 7.2' },
                  { key: 'Connection Pool', value: '50 connections' },
                  { key: 'Backup Schedule', value: 'Every 6 hours' },
                  { key: 'Data Retention', value: '7 years' },
                ],
              },
              {
                title: 'Notification Settings', icon: Settings, items: [
                  { key: 'Critical Alerts', value: 'Email + SMS + Slack' },
                  { key: 'High Alerts', value: 'Email + Slack' },
                  { key: 'Medium Alerts', value: 'Email' },
                  { key: 'Report Delivery', value: 'Email' },
                  { key: 'Escalation Timeout', value: '2 hours' },
                ],
              },
            ].map(section => (
              <div key={section.title} style={{
                background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px',
                border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <section.icon size={18} color="var(--primary-600)" />
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{section.title}</h4>
                </div>
                {section.items.map(item => (
                  <div key={item.key} style={{
                    display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                    borderBottom: '1px solid var(--slate-100)', fontSize: '13px',
                  }}>
                    <span style={{ color: 'var(--slate-500)' }}>{item.key}</span>
                    <span style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '12px' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
