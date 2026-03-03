import React, { useEffect, useRef } from 'react';
import {
  Activity, ShieldAlert, TrendingDown, DollarSign, Ban,
  Bell, Briefcase, Server, Zap, Target, Brain, Clock
} from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import KpiCard from '../components/common/KpiCard';
import Badge from '../components/common/Badge';
import {
  kpiData, transactionVolumeData, fraudByTypeData,
  recentTransactions, alerts, weeklyTrend, riskDistribution,
  detectionMethodBreakdown, hourlyTransactionData, serviceHealth,
} from '../services/mockData';
import {
  formatCurrency, formatNumber, formatPercent,
  formatTimestamp, getRiskColor, getStatusColor, getStatusBg
} from '../utils/formatters';

Chart.register(...registerables);

const ChartCard = ({ title, children, subtitle, style: cardStyle }) => (
  <div style={{
    background: 'white', borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)',
    overflow: 'hidden', ...cardStyle,
  }}>
    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--slate-800)' }}>{title}</h3>
        {subtitle && <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{subtitle}</span>}
      </div>
    </div>
    <div style={{ padding: '16px 20px' }}>{children}</div>
  </div>
);

const MiniChart = ({ chartRef, config }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (canvasRef.current) {
      chartInstance.current = new Chart(canvasRef.current, config);
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [config]);

  return <canvas ref={canvasRef} />;
};

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard title="Total Transactions" value={formatNumber(kpiData.totalTransactions.value)} change={kpiData.totalTransactions.change} icon={Activity} color="var(--primary-600)" subtitle="This month" />
        <KpiCard title="Fraud Detected" value={formatNumber(kpiData.fraudDetected.value)} change={kpiData.fraudDetected.change} icon={ShieldAlert} color="var(--danger-600)" subtitle="This month" />
        <KpiCard title="Fraud Rate" value={formatPercent(kpiData.fraudRate.value)} change={kpiData.fraudRate.change} icon={TrendingDown} color="var(--success-600)" subtitle="This month" />
        <KpiCard title="Volume Processed" value={formatCurrency(kpiData.totalVolume.value)} change={kpiData.totalVolume.change} icon={DollarSign} color="var(--primary-600)" subtitle="This month" />
        <KpiCard title="Active Alerts" value={kpiData.activeAlerts.value} change={kpiData.activeAlerts.change} icon={Bell} color="var(--warning-600)" subtitle="Pending review" />
        <KpiCard title="Avg Response Time" value={`${kpiData.avgResponseTime.value}ms`} change={kpiData.avgResponseTime.change} icon={Zap} color="var(--info-600)" subtitle="P95 latency" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <ChartCard title="Transaction Volume & Fraud Trend" subtitle="Monthly overview - 2026">
          <div style={{ height: 280 }}>
            <MiniChart config={{
              type: 'bar',
              data: {
                labels: transactionVolumeData.labels,
                datasets: [
                  {
                    label: 'Approved (M)',
                    data: transactionVolumeData.approved,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderRadius: 4, barPercentage: 0.6,
                  },
                  {
                    label: 'Flagged (M)',
                    data: transactionVolumeData.flagged,
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderRadius: 4, barPercentage: 0.6,
                  },
                  {
                    label: 'Declined (M)',
                    data: transactionVolumeData.declined,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderRadius: 4, barPercentage: 0.6,
                  },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
                scales: {
                  x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
                  y: { stacked: true, grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}M` } },
                },
              },
            }} />
          </div>
        </ChartCard>

        <ChartCard title="Fraud by Type" subtitle="Distribution">
          <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <MiniChart config={{
              type: 'doughnut',
              data: {
                labels: fraudByTypeData.labels,
                datasets: [{
                  data: fraudByTypeData.values,
                  backgroundColor: fraudByTypeData.colors,
                  borderWidth: 0, hoverOffset: 6,
                }],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 10, font: { size: 10 } } },
                },
              },
            }} />
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ChartCard title="Hourly Transaction Pattern" subtitle="Legitimate vs Fraudulent">
          <div style={{ height: 220 }}>
            <MiniChart config={{
              type: 'line',
              data: {
                labels: hourlyTransactionData.labels,
                datasets: [
                  {
                    label: 'Legitimate (K)',
                    data: hourlyTransactionData.legitimate,
                    borderColor: 'var(--primary-500)', backgroundColor: 'rgba(59,130,246,0.08)',
                    fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
                  },
                  {
                    label: 'Fraudulent (K)',
                    data: hourlyTransactionData.fraudulent,
                    borderColor: 'var(--danger-500)', backgroundColor: 'rgba(239,68,68,0.08)',
                    fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
                  },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 12 } },
                  y: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 } } },
                },
              },
            }} />
          </div>
        </ChartCard>

        <ChartCard title="Detection Method Breakdown" subtitle="How fraud is caught">
          <div style={{ height: 220 }}>
            <MiniChart config={{
              type: 'bar',
              data: {
                labels: detectionMethodBreakdown.labels,
                datasets: [{
                  data: detectionMethodBreakdown.values,
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444', '#f59e0b', '#10b981'],
                  borderRadius: 4, barPercentage: 0.6,
                }],
              },
              options: {
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
                  y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                },
              },
            }} />
          </div>
        </ChartCard>
      </div>

      {/* Risk Distribution & Weekly Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ChartCard title="Risk Score Distribution" subtitle="Transaction risk breakdown">
          <div style={{ height: 220 }}>
            <MiniChart config={{
              type: 'bar',
              data: {
                labels: riskDistribution.labels,
                datasets: [{
                  data: riskDistribution.values,
                  backgroundColor: riskDistribution.colors,
                  borderRadius: 4, barPercentage: 0.7,
                }],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                  y: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
                },
              },
            }} />
          </div>
        </ChartCard>

        <ChartCard title="Weekly Trend" subtitle="Transactions vs Fraud Attempts">
          <div style={{ height: 220 }}>
            <MiniChart config={{
              type: 'line',
              data: {
                labels: weeklyTrend.labels,
                datasets: [
                  {
                    label: 'Transactions (K)',
                    data: weeklyTrend.transactions.map(v => v / 1000),
                    borderColor: 'var(--primary-500)', tension: 0.4, pointRadius: 4,
                    pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2,
                    yAxisID: 'y',
                  },
                  {
                    label: 'Blocked',
                    data: weeklyTrend.blocked,
                    borderColor: 'var(--danger-500)', tension: 0.4, pointRadius: 4,
                    pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2,
                    yAxisID: 'y1',
                  },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                  y: { position: 'left', grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}K` } },
                  y1: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 } } },
                },
              },
            }} />
          </div>
        </ChartCard>
      </div>

      {/* Recent Transactions Table */}
      <ChartCard title="Recent Transactions" subtitle="Last 10 transactions with risk assessment">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--slate-200)' }}>
                {['Transaction ID', 'Time', 'Merchant', 'Type', 'Amount', 'Country', 'Risk Score', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => onNavigate('transactions')}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--primary-600)', fontFamily: 'monospace', fontSize: '12px' }}>{tx.id}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--slate-500)', fontSize: '12px' }}>{formatTimestamp(tx.timestamp)}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{tx.merchant}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--slate-500)' }}>{tx.type}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, fontFamily: 'monospace' }}>{formatCurrency(tx.amount, tx.currency)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: '12px' }}>{tx.country}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--slate-100)', overflow: 'hidden' }}>
                        <div style={{ width: `${tx.riskScore}%`, height: '100%', borderRadius: 3, background: getRiskColor(tx.riskScore) }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: getRiskColor(tx.riskScore), fontFamily: 'monospace' }}>{tx.riskScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}><Badge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Alerts & Service Health Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Active Alerts */}
        <ChartCard title="Active Alerts" subtitle="Requires immediate attention">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alerts.filter(a => a.status !== 'closed').slice(0, 5).map(alert => (
              <div key={alert.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--slate-50)', cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--slate-50)'}
              onClick={() => onNavigate('alerts')}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: alert.severity === 'critical' ? 'var(--danger-500)' : alert.severity === 'high' ? 'var(--warning-500)' : 'var(--info-500)',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--slate-800)' }} className="truncate">{alert.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-500)', marginTop: '2px' }}>{alert.type} • {alert.id}</div>
                </div>
                <Badge status={alert.severity} />
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Service Health */}
        <ChartCard title="Service Health" subtitle="System infrastructure status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {serviceHealth.slice(0, 7).map(svc => (
              <div key={svc.name} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--slate-50)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: svc.status === 'healthy' ? 'var(--success-500)' : 'var(--warning-500)',
                }} />
                <span style={{ flex: 1, fontSize: '13px', fontWeight: 500, color: 'var(--slate-700)' }}>{svc.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--slate-500)', fontFamily: 'monospace' }}>{svc.responseTime}ms</span>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{svc.uptime}%</span>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--slate-200)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${svc.cpu}%`, height: '100%', borderRadius: 2,
                    background: svc.cpu > 80 ? 'var(--danger-500)' : svc.cpu > 60 ? 'var(--warning-500)' : 'var(--success-500)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
