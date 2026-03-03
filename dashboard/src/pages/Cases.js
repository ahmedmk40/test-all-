import React, { useState } from 'react';
import { Search, Plus, Clock, User, FileText, AlertTriangle, ChevronRight, X, Paperclip } from 'lucide-react';
import Badge from '../components/common/Badge';
import { cases } from '../services/mockData';

const priorityColors = {
  critical: { color: 'var(--danger-600)', bg: 'var(--danger-50)' },
  high: { color: 'var(--warning-600)', bg: 'var(--warning-50)' },
  medium: { color: 'var(--info-600)', bg: 'var(--info-50)' },
  low: { color: 'var(--success-600)', bg: 'var(--success-50)' },
};

const CaseDetail = ({ caseItem, onClose }) => (
  <div style={{
    position: 'fixed', top: 0, right: 0, width: '560px', height: '100vh',
    background: 'white', boxShadow: 'var(--shadow-xl)', zIndex: 1000,
    display: 'flex', flexDirection: 'column', animation: 'slideInRight 0.2s ease-out',
  }}>
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-500)' }}>{caseItem.id}</span>
          <Badge status={caseItem.priority} />
          <Badge status={caseItem.status} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{caseItem.title}</h3>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}><X size={20} /></button>
    </div>
    <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Alerts', value: caseItem.alerts, icon: AlertTriangle },
          { label: 'Transactions', value: caseItem.transactions, icon: FileText },
          { label: 'Amount', value: caseItem.amount, icon: null },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--slate-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      {[
        { label: 'Case Type', value: caseItem.type },
        { label: 'Assignee', value: caseItem.assignee },
        { label: 'Created', value: caseItem.created },
        { label: 'Last Update', value: caseItem.lastUpdate },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)' }}>
          <span style={{ color: 'var(--slate-500)', fontSize: '13px' }}>{label}</span>
          <span style={{ fontWeight: 500, fontSize: '13px' }}>{value}</span>
        </div>
      ))}

      {/* Evidence */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Evidence & Attachments</h4>
        {[
          { name: 'transaction_logs_feb28.csv', size: '2.4 MB', date: 'Feb 28, 2026' },
          { name: 'suspicious_patterns.pdf', size: '890 KB', date: 'Mar 1, 2026' },
          { name: 'network_analysis.png', size: '1.2 MB', date: 'Mar 2, 2026' },
        ].map(doc => (
          <div key={doc.name} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
            background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', marginBottom: '6px',
          }}>
            <Paperclip size={14} color="var(--slate-400)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--primary-600)' }}>{doc.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{doc.size} • {doc.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Notes */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Investigation Notes</h4>
        {[
          { author: caseItem.assignee, time: '2 hours ago', note: 'Initial analysis reveals coordinated activity across multiple accounts. Pattern consistent with organized fraud ring.' },
          { author: 'David Park', time: '4 hours ago', note: 'Risk assessment elevated to critical. Recommend immediate review of all linked accounts.' },
        ].map((note, i) => (
          <div key={i} style={{ padding: '12px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-700)' }}>{note.author}</span>
              <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{note.time}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--slate-600)', lineHeight: 1.5 }}>{note.note}</p>
          </div>
        ))}
        <textarea placeholder="Add a note..." style={{
          width: '100%', padding: '12px', border: '1px solid var(--slate-200)',
          borderRadius: 'var(--radius-md)', fontSize: '13px', resize: 'vertical',
          minHeight: '80px', outline: 'none', fontFamily: 'inherit',
        }} />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
          background: 'var(--danger-600)', color: 'white', border: 'none',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>Escalate</button>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
          background: 'var(--primary-600)', color: 'white', border: 'none',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>Update Status</button>
        <button style={{
          flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
          background: 'var(--success-600)', color: 'white', border: 'none',
          fontSize: '13px', fontWeight: 600, cursor: 'pointer',
        }}>Close Case</button>
      </div>
    </div>
  </div>
);

const Cases = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const filtered = cases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Active Cases', value: cases.filter(c => c.status === 'active').length, color: 'var(--primary-600)' },
          { label: 'Critical Priority', value: cases.filter(c => c.priority === 'critical').length, color: 'var(--danger-600)' },
          { label: 'Pending Review', value: cases.filter(c => c.status === 'pending_review' || c.status === 'review').length, color: 'var(--warning-600)' },
          { label: 'Total Amount', value: '$2.4M', color: 'var(--slate-700)' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px',
            border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.05em' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flex: 1,
          background: 'white', borderRadius: 'var(--radius-md)', padding: '8px 16px',
          border: '1px solid var(--slate-200)',
        }}>
          <Search size={16} color="var(--slate-400)" />
          <input type="text" placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', background: 'transparent' }} />
        </div>
        {['all', 'active', 'review', 'pending_review'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid',
            borderColor: statusFilter === s ? 'var(--primary-500)' : 'var(--slate-200)',
            background: statusFilter === s ? 'var(--primary-50)' : 'white',
            color: statusFilter === s ? 'var(--primary-700)' : 'var(--slate-600)',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
          }}>{s === 'all' ? 'All' : s.replace(/_/g, ' ')}</button>
        ))}
        <button style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          background: 'var(--primary-600)', color: 'white', border: 'none',
          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
        }}>
          <Plus size={14} /> New Case
        </button>
      </div>

      {/* Case Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(c => (
          <div key={c.id}
            onClick={() => setSelectedCase(c)}
            style={{
              background: 'white', borderRadius: 'var(--radius-lg)', padding: '20px',
              border: '1px solid var(--slate-200)', cursor: 'pointer',
              transition: 'var(--transition-fast)', boxShadow: 'var(--shadow-sm)',
              borderLeft: `4px solid ${priorityColors[c.priority].color}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-500)' }}>{c.id}</span>
                  <Badge status={c.priority} />
                  <Badge status={c.status} />
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '9999px',
                    background: 'var(--slate-100)', color: 'var(--slate-600)', fontWeight: 500,
                  }}>{c.type}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '8px' }}>{c.title}</h4>
                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--slate-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {c.assignee}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12} /> {c.alerts} alerts
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={12} /> {c.transactions} txns
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {c.lastUpdate}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--slate-800)' }}>{c.amount}</div>
                <div style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: '2px' }}>Total exposure</div>
              </div>
              <ChevronRight size={16} color="var(--slate-300)" style={{ marginTop: '8px' }} />
            </div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }} onClick={() => setSelectedCase(null)} />
          <CaseDetail caseItem={selectedCase} onClose={() => setSelectedCase(null)} />
        </>
      )}
    </div>
  );
};

export default Cases;
