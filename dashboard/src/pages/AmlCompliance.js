import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Search, Shield, AlertTriangle, FileText, Globe, ChevronRight, X, Upload, Download, Eye } from 'lucide-react';
import Badge from '../components/common/Badge';
import { amlCases } from '../services/mockData';

Chart.register(...registerables);

const riskLevelConfig = {
  critical: { color: 'var(--danger-600)', bg: 'var(--danger-50)', label: 'Critical Risk' },
  high: { color: 'var(--warning-600)', bg: 'var(--warning-50)', label: 'High Risk' },
  medium: { color: 'var(--info-600)', bg: 'var(--info-50)', label: 'Medium Risk' },
  low: { color: 'var(--success-600)', bg: 'var(--success-50)', label: 'Low Risk' },
};

const watchlistEntries = [
  { id: 'WL-001', name: 'Pacific Trading Ltd', list: 'OFAC SDN', country: 'Cayman Islands', type: 'Entity', matchScore: 98, status: 'confirmed' },
  { id: 'WL-002', name: 'Ahmad Hassan Al-Rashid', list: 'Internal', country: 'UAE', type: 'Individual', matchScore: 87, status: 'pending_review' },
  { id: 'WL-003', name: 'Eastern Imports Co', list: 'EU Sanctions', country: 'Hong Kong', type: 'Entity', matchScore: 92, status: 'confirmed' },
  { id: 'WL-004', name: 'Viktor Petrov', list: 'PEP List', country: 'Russia', type: 'Individual', matchScore: 78, status: 'monitoring' },
  { id: 'WL-005', name: 'Global Ventures LLC', list: 'OFAC SDN', country: 'Iran', type: 'Entity', matchScore: 95, status: 'confirmed' },
  { id: 'WL-006', name: 'Chen Wei International', list: 'Internal', country: 'China', type: 'Entity', matchScore: 65, status: 'cleared' },
];

const AmlCompliance = () => {
  const [tab, setTab] = useState('cases');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Structuring', 'Layering', 'Shell Company', 'PEP', 'High Risk Country', 'Integration'],
          datasets: [{
            data: [28, 22, 18, 15, 12, 5],
            backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981'],
            borderWidth: 0, hoverOffset: 6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '60%',
          plugins: { legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } } },
        },
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  const tabs = [
    { id: 'cases', label: 'AML Cases', count: amlCases.length },
    { id: 'watchlist', label: 'Watchlist', count: watchlistEntries.length },
    { id: 'reports', label: 'Regulatory Reports', count: 12 },
    { id: 'risk', label: 'Risk Assessments', count: 45 },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { label: 'Active Investigations', value: '5', color: 'var(--danger-600)', icon: Shield },
          { label: 'SAR Filed', value: '2', color: 'var(--warning-600)', icon: FileText },
          { label: 'Watchlist Matches', value: '23', color: 'var(--primary-600)', icon: AlertTriangle },
          { label: 'High-Risk Entities', value: '147', color: 'var(--info-600)', icon: Globe },
          { label: 'Compliance Score', value: '94%', color: 'var(--success-600)', icon: Shield },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
            border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <stat.icon size={16} color={stat.color} />
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
        {/* Main content */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--slate-100)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                background: tab === t.id ? 'white' : 'transparent',
                border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? 'var(--slate-800)' : 'var(--slate-500)',
                boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-fast)',
              }}>
                {t.label} <span style={{ marginLeft: '4px', padding: '1px 6px', borderRadius: '9999px', background: tab === t.id ? 'var(--primary-50)' : 'var(--slate-200)', fontSize: '10px', fontWeight: 700, color: tab === t.id ? 'var(--primary-600)' : 'var(--slate-500)' }}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
            background: 'white', borderRadius: 'var(--radius-md)', padding: '8px 16px',
            border: '1px solid var(--slate-200)',
          }}>
            <Search size={16} color="var(--slate-400)" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent' }} />
          </div>

          {tab === 'cases' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {amlCases.filter(c => !search || c.entity.toLowerCase().includes(search.toLowerCase())).map(c => (
                <div key={c.id}
                  onClick={() => setSelectedCase(c)}
                  style={{
                    background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                    border: '1px solid var(--slate-200)', cursor: 'pointer',
                    transition: 'var(--transition-fast)', boxShadow: 'var(--shadow-sm)',
                    borderLeft: `4px solid ${riskLevelConfig[c.riskLevel].color}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-500)' }}>{c.id}</span>
                        <Badge status={c.riskLevel} />
                        <Badge status={c.status} />
                        {c.sarFiled && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '9999px', background: 'var(--warning-50)', color: 'var(--warning-700)', fontWeight: 600 }}>SAR Filed</span>}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{c.entity}</div>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', display: 'flex', gap: '16px' }}>
                        <span>{c.type}</span>
                        <span>{c.country}</span>
                        <span>{c.assignee}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>{c.amount}</div>
                      <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>Exposure</div>
                    </div>
                    <ChevronRight size={16} color="var(--slate-300)" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'watchlist' && (
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--slate-100)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', background: 'white', cursor: 'pointer', fontSize: '12px', color: 'var(--slate-600)' }}>
                  <Upload size={13} /> Import
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)', background: 'white', cursor: 'pointer', fontSize: '12px', color: 'var(--slate-600)' }}>
                  <Download size={13} /> Export
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                    {['ID', 'Name', 'List', 'Country', 'Type', 'Match %', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {watchlistEntries.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase())).map(entry => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid var(--slate-100)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary-600)' }}>{entry.id}</td>
                      <td style={{ padding: '12px', fontWeight: 500 }}>{entry.name}</td>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', background: 'var(--slate-100)', fontWeight: 500 }}>{entry.list}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px' }}>{entry.country}</td>
                      <td style={{ padding: '12px', fontSize: '12px' }}>{entry.type}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
                          color: entry.matchScore >= 90 ? 'var(--danger-600)' : entry.matchScore >= 75 ? 'var(--warning-600)' : 'var(--slate-600)',
                        }}>{entry.matchScore}%</span>
                      </td>
                      <td style={{ padding: '12px' }}><Badge status={entry.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'RPT-2026-Q1', name: 'Q1 2026 SAR Summary', type: 'SAR', status: 'submitted', deadline: '2026-04-15', filed: 3 },
                { id: 'RPT-2026-02', name: 'February CTR Report', type: 'CTR', status: 'approved', deadline: '2026-03-15', filed: 45 },
                { id: 'RPT-2026-01', name: 'January CTR Report', type: 'CTR', status: 'submitted', deadline: '2026-02-15', filed: 42 },
                { id: 'RPT-ANN-2025', name: 'Annual BSA/AML Report 2025', type: 'Annual', status: 'submitted', deadline: '2026-03-31', filed: 1 },
              ].map(report => (
                <div key={report.id} style={{
                  background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                  border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <FileText size={20} color="var(--primary-500)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{report.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{report.type} • Deadline: {report.deadline} • {report.filed} filings</div>
                  </div>
                  <Badge status={report.status === 'submitted' ? 'active' : 'review'}>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {tab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { entity: 'Pacific Trading Ltd', score: 95, factors: ['Shell company indicators', 'High-risk jurisdiction', 'Complex ownership'], trend: 'increasing' },
                { entity: 'Ahmad Hassan', score: 82, factors: ['Structuring patterns', 'Rapid fund movement'], trend: 'stable' },
                { entity: 'Eastern Imports Co', score: 78, factors: ['Layering activity', 'Unusual business patterns'], trend: 'increasing' },
                { entity: 'Viktor Petrov', score: 65, factors: ['PEP exposure', 'Cross-border transfers'], trend: 'decreasing' },
              ].map(assessment => (
                <div key={assessment.entity} style={{
                  background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                  border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{assessment.entity}</div>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Trend: {assessment.trend}</div>
                    </div>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: assessment.score >= 80 ? 'var(--danger-50)' : assessment.score >= 60 ? 'var(--warning-50)' : 'var(--success-50)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: 800, fontFamily: 'monospace',
                      color: assessment.score >= 80 ? 'var(--danger-600)' : assessment.score >= 60 ? 'var(--warning-600)' : 'var(--success-600)',
                    }}>{assessment.score}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {assessment.factors.map(f => (
                      <span key={f} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', background: 'var(--slate-100)', color: 'var(--slate-600)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Case Type Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--slate-200)', padding: '20px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Cases by Type</h3>
            <div style={{ height: 240 }}><canvas ref={chartRef} /></div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--slate-200)', padding: '20px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Compliance Activity</h3>
            {[
              { action: 'SAR filed for AML-2044', time: '15 min ago', type: 'filing' },
              { action: 'Watchlist updated - OFAC', time: '2 hours ago', type: 'update' },
              { action: 'Risk assessment completed', time: '4 hours ago', type: 'assessment' },
              { action: 'Case AML-2043 escalated', time: '6 hours ago', type: 'escalation' },
              { action: 'CTR report submitted', time: '1 day ago', type: 'report' },
            ].map((activity, i) => (
              <div key={i} style={{
                display: 'flex', gap: '10px', padding: '8px 0',
                borderBottom: i < 4 ? '1px solid var(--slate-100)' : 'none',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                  background: activity.type === 'filing' ? 'var(--danger-500)' : activity.type === 'escalation' ? 'var(--warning-500)' : 'var(--primary-500)',
                }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{activity.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmlCompliance;
