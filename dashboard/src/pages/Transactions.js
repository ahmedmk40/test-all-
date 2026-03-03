import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Search, Filter, Download, Eye, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import Badge from '../components/common/Badge';
import { recentTransactions, hourlyTransactionData } from '../services/mockData';
import { formatCurrency, formatTimestamp, getRiskColor } from '../utils/formatters';

Chart.register(...registerables);

const allTransactions = [
  ...recentTransactions,
  { id: 'TXN-2847553', timestamp: '2026-03-03T14:13:10Z', amount: 1200.00, currency: 'USD', merchant: 'Apple Store', type: 'E-commerce', status: 'approved', riskScore: 10, cardLast4: '4455', country: 'US' },
  { id: 'TXN-2847552', timestamp: '2026-03-03T14:12:05Z', amount: 5600.00, currency: 'EUR', merchant: 'Luxury Goods Co', type: 'POS', status: 'review', riskScore: 58, cardLast4: '7788', country: 'IT' },
  { id: 'TXN-2847551', timestamp: '2026-03-03T14:11:00Z', amount: 34.99, currency: 'USD', merchant: 'Spotify', type: 'Subscription', status: 'approved', riskScore: 2, cardLast4: '3344', country: 'SE' },
  { id: 'TXN-2847550', timestamp: '2026-03-03T14:10:30Z', amount: 8750.00, currency: 'GBP', merchant: 'Transfer Co Ltd', type: 'Wire', status: 'blocked', riskScore: 87, cardLast4: '9900', country: 'NG' },
  { id: 'TXN-2847549', timestamp: '2026-03-03T14:09:15Z', amount: 156.80, currency: 'USD', merchant: 'Walmart', type: 'POS', status: 'approved', riskScore: 4, cardLast4: '2211', country: 'US' },
  { id: 'TXN-2847548', timestamp: '2026-03-03T14:08:00Z', amount: 2999.99, currency: 'USD', merchant: 'Electronics Hub', type: 'E-commerce', status: 'review', riskScore: 62, cardLast4: '5566', country: 'CN' },
  { id: 'TXN-2847547', timestamp: '2026-03-03T14:07:22Z', amount: 0.50, currency: 'USD', merchant: 'Test Charge', type: 'CNP', status: 'blocked', riskScore: 96, cardLast4: '1100', country: 'UA' },
  { id: 'TXN-2847546', timestamp: '2026-03-03T14:06:10Z', amount: 450.00, currency: 'CAD', merchant: 'Air Canada', type: 'E-commerce', status: 'approved', riskScore: 14, cardLast4: '8833', country: 'CA' },
  { id: 'TXN-2847545', timestamp: '2026-03-03T14:05:55Z', amount: 12000.00, currency: 'USD', merchant: 'Offshore Holdings', type: 'Wire', status: 'blocked', riskScore: 91, cardLast4: '6677', country: 'KY' },
  { id: 'TXN-2847544', timestamp: '2026-03-03T14:04:30Z', amount: 67.50, currency: 'EUR', merchant: 'Deliveroo', type: 'Mobile', status: 'approved', riskScore: 6, cardLast4: '4411', country: 'FR' },
];

const TransactionDetail = ({ tx, onClose }) => (
  <div style={{
    position: 'fixed', top: 0, right: 0, width: '480px', height: '100vh',
    background: 'white', boxShadow: 'var(--shadow-xl)', zIndex: 1000,
    display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.2s ease-out',
  }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Transaction Details</h3>
        <span style={{ fontSize: '12px', color: 'var(--slate-500)', fontFamily: 'monospace' }}>{tx.id}</span>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '4px' }}>
        <X size={20} />
      </button>
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{formatCurrency(tx.amount, tx.currency)}</div>
          <div style={{ color: 'var(--slate-500)', fontSize: '13px', marginTop: '4px' }}>{tx.merchant}</div>
        </div>
        <Badge status={tx.status} size="md" />
      </div>

      {/* Risk Gauge */}
      <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Assessment</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: getRiskColor(tx.riskScore), fontFamily: 'monospace' }}>{tx.riskScore}</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 10, borderRadius: 5, background: 'var(--slate-200)', overflow: 'hidden' }}>
              <div style={{ width: `${tx.riskScore}%`, height: '100%', borderRadius: 5, background: getRiskColor(tx.riskScore), transition: 'width 0.5s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      {[
        { label: 'Transaction Type', value: tx.type },
        { label: 'Country', value: tx.country },
        { label: 'Card Last 4', value: `•••• ${tx.cardLast4}` },
        { label: 'Timestamp', value: formatTimestamp(tx.timestamp) },
        { label: 'Currency', value: tx.currency },
        { label: 'Processing Time', value: '23ms' },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
          <span style={{ color: 'var(--slate-500)', fontSize: '13px' }}>{label}</span>
          <span style={{ fontWeight: 500, fontSize: '13px' }}>{value}</span>
        </div>
      ))}

      {/* Signals */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detection Signals</div>
        {tx.riskScore > 60 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { signal: 'Velocity Check', score: Math.min(tx.riskScore + 5, 100), source: 'Velocity Service' },
              { signal: 'Rule Match', score: Math.min(tx.riskScore - 10, 100), source: 'Rule Engine' },
              { signal: 'ML Prediction', score: tx.riskScore, source: 'Fraud Classifier v3.2' },
            ].map(s => (
              <div key={s.signal} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: getRiskColor(s.score) }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.signal}</div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{s.source}</div>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: getRiskColor(s.score) }}>{s.score}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '12px', background: 'var(--success-50)', borderRadius: 'var(--radius-md)', color: 'var(--success-700)', fontSize: '13px' }}>
            No significant risk signals detected
          </div>
        )}
      </div>
    </div>
  </div>
);

const Transactions = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: hourlyTransactionData.labels,
          datasets: [{
            label: 'Transaction Volume',
            data: hourlyTransactionData.legitimate,
            borderColor: 'var(--primary-500)',
            backgroundColor: 'rgba(59,130,246,0.1)',
            fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 12 } },
            y: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 10 } } },
          },
        },
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  const filtered = allTransactions
    .filter(tx => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) &&
          !tx.merchant.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'amount') return (a.amount - b.amount) * dir;
      if (sortField === 'riskScore') return (a.riskScore - b.riskScore) * dir;
      return (new Date(a.timestamp) - new Date(b.timestamp)) * dir;
    });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Volume Chart */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Transaction Volume - Today</h3>
        <div style={{ height: 120 }}><canvas ref={chartRef} /></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '300px',
          background: 'white', borderRadius: 'var(--radius-md)', padding: '8px 16px',
          border: '1px solid var(--slate-200)',
        }}>
          <Search size={16} color="var(--slate-400)" />
          <input
            type="text" placeholder="Search by Transaction ID or Merchant..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent' }}
          />
        </div>
        {['all', 'approved', 'review', 'blocked'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid',
            borderColor: statusFilter === s ? 'var(--primary-500)' : 'var(--slate-200)',
            background: statusFilter === s ? 'var(--primary-50)' : 'white',
            color: statusFilter === s ? 'var(--primary-700)' : 'var(--slate-600)',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--slate-200)', background: 'white',
          cursor: 'pointer', color: 'var(--slate-600)', fontSize: '12px', fontWeight: 500,
        }}>
          <Download size={14} /> Export
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                {[
                  { key: 'id', label: 'Transaction ID' },
                  { key: 'timestamp', label: 'Timestamp', sortable: true },
                  { key: 'merchant', label: 'Merchant' },
                  { key: 'type', label: 'Type' },
                  { key: 'amount', label: 'Amount', sortable: true },
                  { key: 'country', label: 'Country' },
                  { key: 'riskScore', label: 'Risk', sortable: true },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: '' },
                ].map(col => (
                  <th key={col.key}
                    onClick={() => col.sortable && (setSortField(col.key), setSortDir(d => d === 'asc' ? 'desc' : 'asc'))}
                    style={{
                      textAlign: 'left', padding: '12px', fontSize: '11px', fontWeight: 600,
                      color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em',
                      cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none',
                    }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {col.sortable && <ArrowUpDown size={12} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id}
                  style={{ borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedTx(tx)}
                >
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--primary-600)', fontFamily: 'monospace', fontSize: '12px' }}>{tx.id}</td>
                  <td style={{ padding: '12px', color: 'var(--slate-500)', fontSize: '12px' }}>{formatTimestamp(tx.timestamp)}</td>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{tx.merchant}</td>
                  <td style={{ padding: '12px', color: 'var(--slate-500)' }}>{tx.type}</td>
                  <td style={{ padding: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{formatCurrency(tx.amount, tx.currency)}</td>
                  <td style={{ padding: '12px' }}>{tx.country}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 48, height: 6, borderRadius: 3, background: 'var(--slate-100)', overflow: 'hidden' }}>
                        <div style={{ width: `${tx.riskScore}%`, height: '100%', borderRadius: 3, background: getRiskColor(tx.riskScore) }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: getRiskColor(tx.riskScore), fontFamily: 'monospace', width: 24 }}>{tx.riskScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}><Badge status={tx.status} /></td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '4px' }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--slate-100)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '12px', color: 'var(--slate-500)',
        }}>
          <span>Showing {filtered.length} of {allTransactions.length} transactions</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, '...', 142].map((p, i) => (
              <button key={i} style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-sm)', border: p === 1 ? 'none' : '1px solid var(--slate-200)',
                background: p === 1 ? 'var(--primary-600)' : 'white',
                color: p === 1 ? 'white' : 'var(--slate-600)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedTx && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }} onClick={() => setSelectedTx(null)} />
          <TransactionDetail tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </>
      )}
    </div>
  );
};

export default Transactions;
