import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Search, Plus, Edit, ToggleLeft, ToggleRight, Trash2, Copy, TrendingUp, Zap, Target, AlertTriangle } from 'lucide-react';
import Badge from '../components/common/Badge';
import { rules } from '../services/mockData';

Chart.register(...registerables);

const typeIcons = {
  Amount: '💰', Velocity: '⚡', Geographical: '🌍', Pattern: '🔍',
  Behavioral: '🧠', Combination: '🔗', Merchant: '🏪',
};

const Rules = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRule, setSelectedRule] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: rules.map(r => r.name.length > 20 ? r.name.substring(0, 20) + '...' : r.name),
          datasets: [
            {
              label: 'True Positives',
              data: rules.map(r => r.triggers - r.falsePositives),
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderRadius: 4,
            },
            {
              label: 'False Positives',
              data: rules.map(r => r.falsePositives),
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
            y: { stacked: true, grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 } } },
          },
        },
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  const filtered = rules.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const types = [...new Set(rules.map(r => r.type))];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Rules', value: rules.length, icon: Zap, color: 'var(--primary-600)' },
          { label: 'Active Rules', value: rules.filter(r => r.status === 'active').length, icon: ToggleRight, color: 'var(--success-600)' },
          { label: 'Avg Accuracy', value: `${(rules.reduce((s, r) => s + r.accuracy, 0) / rules.length).toFixed(1)}%`, icon: Target, color: 'var(--info-600)' },
          { label: 'Total Triggers', value: rules.reduce((s, r) => s + r.triggers, 0).toLocaleString(), icon: AlertTriangle, color: 'var(--warning-600)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
            border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: `${stat.color}11`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--slate-900)' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--slate-200)', padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Rule Performance - Triggers vs False Positives</h3>
        <div style={{ height: 200 }}><canvas ref={chartRef} /></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '300px',
          background: 'white', borderRadius: 'var(--radius-md)', padding: '8px 16px',
          border: '1px solid var(--slate-200)',
        }}>
          <Search size={16} color="var(--slate-400)" />
          <input type="text" placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent' }} />
        </div>
        <button onClick={() => setTypeFilter('all')} style={{
          padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid',
          borderColor: typeFilter === 'all' ? 'var(--primary-500)' : 'var(--slate-200)',
          background: typeFilter === 'all' ? 'var(--primary-50)' : 'white',
          color: typeFilter === 'all' ? 'var(--primary-700)' : 'var(--slate-600)',
          fontSize: '12px', fontWeight: 500, cursor: 'pointer',
        }}>All Types</button>
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid',
            borderColor: typeFilter === t ? 'var(--primary-500)' : 'var(--slate-200)',
            background: typeFilter === t ? 'var(--primary-50)' : 'white',
            color: typeFilter === t ? 'var(--primary-700)' : 'var(--slate-600)',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          }}>{typeIcons[t]} {t}</button>
        ))}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          background: 'var(--primary-600)', color: 'white', border: 'none',
          cursor: 'pointer', fontSize: '12px', fontWeight: 600, marginLeft: 'auto',
        }}>
          <Plus size={14} /> Create Rule
        </button>
      </div>

      {/* Rules Table */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--slate-200)', background: 'var(--slate-50)' }}>
                {['Rule ID', 'Name', 'Type', 'Status', 'Triggers', 'Accuracy', 'False Pos.', 'Priority', 'Modified', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(rule => (
                <tr key={rule.id}
                  style={{ borderBottom: '1px solid var(--slate-100)', transition: 'var(--transition-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--primary-600)', fontWeight: 600 }}>{rule.id}</td>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{rule.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{typeIcons[rule.type]}</span>
                      <span style={{ color: 'var(--slate-600)', fontSize: '12px' }}>{rule.type}</span>
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}><Badge status={rule.status} /></td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{rule.triggers.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 48, height: 6, borderRadius: 3, background: 'var(--slate-100)', overflow: 'hidden' }}>
                        <div style={{
                          width: `${rule.accuracy}%`, height: '100%', borderRadius: 3,
                          background: rule.accuracy >= 95 ? 'var(--success-500)' : rule.accuracy >= 90 ? 'var(--warning-500)' : 'var(--danger-500)',
                        }} />
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>{rule.accuracy}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: rule.falsePositives > 100 ? 'var(--danger-600)' : 'var(--slate-600)' }}>{rule.falsePositives}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 24, height: 24, borderRadius: '50%',
                      background: rule.priority === 1 ? 'var(--danger-50)' : rule.priority === 2 ? 'var(--warning-50)' : 'var(--slate-100)',
                      color: rule.priority === 1 ? 'var(--danger-600)' : rule.priority === 2 ? 'var(--warning-600)' : 'var(--slate-600)',
                      fontSize: '11px', fontWeight: 700,
                    }}>P{rule.priority}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: 'var(--slate-500)' }}>{rule.lastModified}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[
                        { icon: Edit, title: 'Edit' },
                        { icon: Copy, title: 'Duplicate' },
                        { icon: rule.status === 'active' ? ToggleRight : ToggleLeft, title: 'Toggle' },
                      ].map(({ icon: Icon, title }) => (
                        <button key={title} title={title} style={{
                          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 'var(--radius-sm)', border: '1px solid var(--slate-200)',
                          background: 'white', cursor: 'pointer', color: 'var(--slate-500)',
                          transition: 'var(--transition-fast)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--slate-50)'; e.currentTarget.style.color = 'var(--slate-700)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--slate-500)'; }}
                        >
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
      </div>
    </div>
  );
};

export default Rules;
