import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { FileText, Download, Calendar, Clock, BarChart3, TrendingUp, PieChart, Filter } from 'lucide-react';
import Badge from '../components/common/Badge';
import { kpiData, transactionVolumeData, fraudByChannelData, geoFraudData } from '../services/mockData';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

Chart.register(...registerables);

const reportTemplates = [
  { id: 'RPT-FRAUD', name: 'Fraud Summary Report', description: 'Comprehensive fraud detection metrics and trends', frequency: 'Daily', lastGenerated: '2026-03-03', icon: BarChart3 },
  { id: 'RPT-TXN', name: 'Transaction Analytics', description: 'Transaction volumes, approval rates, and processing metrics', frequency: 'Daily', lastGenerated: '2026-03-03', icon: TrendingUp },
  { id: 'RPT-AML', name: 'AML Compliance Report', description: 'Anti-money laundering cases, SARs, and compliance metrics', frequency: 'Weekly', lastGenerated: '2026-03-01', icon: FileText },
  { id: 'RPT-RULE', name: 'Rule Performance Report', description: 'Rule trigger rates, accuracy, and false positive analysis', frequency: 'Weekly', lastGenerated: '2026-03-01', icon: Filter },
  { id: 'RPT-ML', name: 'ML Model Report', description: 'Model performance, prediction distributions, and drift analysis', frequency: 'Monthly', lastGenerated: '2026-03-01', icon: PieChart },
  { id: 'RPT-GEO', name: 'Geographic Risk Report', description: 'Country-level fraud rates and geographic risk analysis', frequency: 'Monthly', lastGenerated: '2026-03-01', icon: BarChart3 },
];

const Reports = () => {
  const [tab, setTab] = useState('templates');
  const [dateRange, setDateRange] = useState('30d');
  const channelRef = useRef(null);
  const channelChart = useRef(null);
  const trendRef = useRef(null);
  const trendChart = useRef(null);

  useEffect(() => {
    if (channelChart.current) channelChart.current.destroy();
    if (channelRef.current) {
      channelChart.current = new Chart(channelRef.current, {
        type: 'polarArea',
        data: {
          labels: fraudByChannelData.labels,
          datasets: [{
            data: fraudByChannelData.values,
            backgroundColor: ['rgba(59,130,246,0.6)', 'rgba(139,92,246,0.6)', 'rgba(239,68,68,0.6)', 'rgba(245,158,11,0.6)', 'rgba(6,182,212,0.6)', 'rgba(16,185,129,0.6)'],
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 10, font: { size: 11 } } } },
        },
      });
    }
    return () => { if (channelChart.current) channelChart.current.destroy(); };
  }, []);

  useEffect(() => {
    if (trendChart.current) trendChart.current.destroy();
    if (trendRef.current) {
      trendChart.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: transactionVolumeData.labels,
          datasets: [
            {
              label: 'Fraud Rate (%)',
              data: transactionVolumeData.declined.map((d, i) => ((d / transactionVolumeData.approved[i]) * 100).toFixed(2)),
              borderColor: 'var(--danger-500)', backgroundColor: 'rgba(239,68,68,0.1)',
              fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
          },
        },
      });
    }
    return () => { if (trendChart.current) trendChart.current.destroy(); };
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--slate-100)', borderRadius: 'var(--radius-md)', padding: '4px' }}>
          {[
            { id: 'templates', label: 'Report Templates' },
            { id: 'analytics', label: 'Live Analytics' },
            { id: 'scheduled', label: 'Scheduled Reports' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
              background: tab === t.id ? 'white' : 'transparent',
              cursor: 'pointer', fontSize: '13px', fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--slate-800)' : 'var(--slate-500)',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['7d', '30d', '90d', '1y'].map(d => (
            <button key={d} onClick={() => setDateRange(d)} style={{
              padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: dateRange === d ? 'var(--primary-500)' : 'var(--slate-200)',
              background: dateRange === d ? 'var(--primary-50)' : 'white',
              color: dateRange === d ? 'var(--primary-700)' : 'var(--slate-600)',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            }}>{d}</button>
          ))}
        </div>
      </div>

      {tab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {reportTemplates.map(report => (
            <div key={report.id} style={{
              background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px',
              border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition-fast)', cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--slate-300)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <report.icon size={20} color="var(--primary-600)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{report.name}</h4>
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '9999px',
                    background: 'var(--slate-100)', color: 'var(--slate-600)',
                  }}>{report.frequency}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: '16px' }}>{report.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>Last: {report.lastGenerated}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-200)', background: 'white',
                    fontSize: '11px', fontWeight: 500, cursor: 'pointer', color: 'var(--slate-600)',
                  }}>
                    <Calendar size={12} /> Schedule
                  </button>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-600)', color: 'white', border: 'none',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    <Download size={12} /> Generate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'analytics' && (
        <>
          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--slate-200)', padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Fraud Rate Trend</h3>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '12px' }}>Monthly fraud rate as percentage of total transactions</p>
              <div style={{ height: 240 }}><canvas ref={trendRef} /></div>
            </div>
            <div style={{
              background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--slate-200)', padding: '20px',
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Fraud by Channel</h3>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '12px' }}>Distribution across payment channels</p>
              <div style={{ height: 240 }}><canvas ref={channelRef} /></div>
            </div>
          </div>

          {/* Geo Table */}
          <div style={{
            background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--slate-200)', overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Geographic Risk Analysis</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                  {['Country', 'Transactions', 'Fraud Rate', 'Fraud Amount', 'Risk Level'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {geoFraudData.map(row => (
                  <tr key={row.country} style={{ borderBottom: '1px solid var(--slate-100)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px', fontWeight: 500 }}>{row.country}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{row.transactions.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontFamily: 'monospace', fontWeight: 600,
                        color: row.fraudRate > 1 ? 'var(--danger-600)' : row.fraudRate > 0.2 ? 'var(--warning-600)' : 'var(--success-600)',
                      }}>{row.fraudRate}%</span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{row.amount}</td>
                    <td style={{ padding: '12px' }}>
                      <Badge status={row.fraudRate > 1 ? 'critical' : row.fraudRate > 0.2 ? 'warning' : 'active'}>
                        {row.fraudRate > 1 ? 'High Risk' : row.fraudRate > 0.2 ? 'Medium' : 'Low Risk'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'scheduled' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { name: 'Daily Fraud Summary', schedule: 'Every day at 08:00 UTC', nextRun: '2026-03-04 08:00', recipients: 'fraud-team@company.com', format: 'PDF' },
            { name: 'Weekly AML Report', schedule: 'Every Monday at 09:00 UTC', nextRun: '2026-03-09 09:00', recipients: 'compliance@company.com', format: 'PDF + CSV' },
            { name: 'Monthly Executive Summary', schedule: '1st of month at 07:00 UTC', nextRun: '2026-04-01 07:00', recipients: 'executive@company.com', format: 'PDF' },
            { name: 'Rule Performance Weekly', schedule: 'Every Friday at 17:00 UTC', nextRun: '2026-03-06 17:00', recipients: 'risk-team@company.com', format: 'CSV' },
          ].map(sched => (
            <div key={sched.name} style={{
              background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
              border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Clock size={18} color="var(--primary-600)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{sched.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--slate-500)', display: 'flex', gap: '16px', marginTop: '2px' }}>
                  <span>{sched.schedule}</span>
                  <span>To: {sched.recipients}</span>
                </div>
              </div>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '9999px', background: 'var(--slate-100)', color: 'var(--slate-600)', fontWeight: 500 }}>{sched.format}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Next run</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{sched.nextRun}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
