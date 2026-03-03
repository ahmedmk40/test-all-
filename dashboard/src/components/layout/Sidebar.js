import React from 'react';
import {
  LayoutDashboard, Activity, Bell, Briefcase, Shield, BookOpen,
  Brain, Settings, FileText, ChevronLeft, ChevronRight,
  Zap, Database, Users, Search
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
  { id: 'transactions', label: 'Transactions', icon: Activity, section: 'Operations' },
  { id: 'alerts', label: 'Alerts', icon: Bell, section: 'Operations', badge: 187 },
  { id: 'cases', label: 'Cases', icon: Briefcase, section: 'Operations', badge: 43 },
  { id: 'rules', label: 'Rules', icon: Zap, section: 'Detection' },
  { id: 'aml', label: 'AML / Compliance', icon: Shield, section: 'Detection' },
  { id: 'ml-models', label: 'ML Models', icon: Brain, section: 'Detection' },
  { id: 'reports', label: 'Reports', icon: FileText, section: 'Analytics' },
  { id: 'admin', label: 'Administration', icon: Settings, section: 'System' },
];

const Sidebar = ({ activePage, onNavigate, collapsed, onToggle }) => {
  const sections = [...new Set(navItems.map(i => i.section))];

  return (
    <div style={{
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      height: '100vh',
      background: 'var(--slate-900)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--transition-slow)',
      position: 'relative',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: 'var(--header-height)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Shield size={20} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              FraudShield
            </div>
            <div style={{ color: 'var(--slate-400)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Enterprise Platform
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)',
            padding: '8px 12px', cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <Search size={14} color="var(--slate-400)" />
            <span style={{ color: 'var(--slate-500)', fontSize: '13px' }}>Search...</span>
            <span style={{
              marginLeft: 'auto', color: 'var(--slate-500)', fontSize: '10px',
              background: 'rgba(255,255,255,0.06)', padding: '2px 6px',
              borderRadius: '4px', fontWeight: 500,
            }}>⌘K</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
        {sections.map(section => (
          <div key={section} style={{ marginBottom: '4px' }}>
            {!collapsed && (
              <div style={{
                padding: '8px 16px 4px',
                fontSize: '10px', fontWeight: 600, color: 'var(--slate-500)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {section}
              </div>
            )}
            {navItems.filter(i => i.section === section).map(item => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '10px 0' : '10px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))'
                      : 'transparent',
                    color: isActive ? 'white' : 'var(--slate-400)',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    marginBottom: '2px',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = 'var(--slate-200)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--slate-400)';
                    }
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute', left: collapsed ? '50%' : 0, bottom: collapsed ? 0 : '50%',
                      width: collapsed ? '24px' : '3px', height: collapsed ? '3px' : '24px',
                      background: 'var(--primary-500)', borderRadius: '2px',
                      transform: collapsed ? 'translateX(-50%)' : 'translateY(50%)',
                    }} />
                  )}
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: item.badge > 100 ? 'var(--danger-600)' : 'var(--primary-600)',
                          color: 'white', fontSize: '10px', fontWeight: 700,
                          padding: '1px 6px', borderRadius: '9999px',
                          minWidth: '20px', textAlign: 'center',
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 12px', marginBottom: '8px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: 'white',
            }}>SC</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--slate-200)', fontSize: '12px', fontWeight: 600 }}>Sarah Chen</div>
              <div style={{ color: 'var(--slate-500)', fontSize: '10px' }}>Fraud Analyst</div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--slate-400)', fontSize: '12px',
            cursor: 'pointer', transition: 'var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
