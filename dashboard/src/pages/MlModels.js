import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Brain, TrendingUp, Target, Cpu, BarChart3, RefreshCw, Play, Pause, Eye } from 'lucide-react';
import Badge from '../components/common/Badge';
import { mlModels, modelPerformanceHistory } from '../services/mockData';

Chart.register(...registerables);

const MlModels = () => {
  const [selectedModel, setSelectedModel] = useState(mlModels[0]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const confusionRef = useRef(null);
  const confusionInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: modelPerformanceHistory.labels,
          datasets: [
            { label: 'Accuracy', data: modelPerformanceHistory.accuracy, borderColor: '#3b82f6', tension: 0.4, pointRadius: 3, pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2 },
            { label: 'Precision', data: modelPerformanceHistory.precision, borderColor: '#8b5cf6', tension: 0.4, pointRadius: 3, pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2 },
            { label: 'Recall', data: modelPerformanceHistory.recall, borderColor: '#f59e0b', tension: 0.4, pointRadius: 3, pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2 },
            { label: 'F1 Score', data: modelPerformanceHistory.f1, borderColor: '#10b981', tension: 0.4, pointRadius: 3, pointBackgroundColor: 'white', pointBorderWidth: 2, borderWidth: 2 },
          ],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { min: 94, max: 100, grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 }, callback: v => `${v}%` } },
          },
        },
      });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, []);

  useEffect(() => {
    if (confusionInstance.current) confusionInstance.current.destroy();
    if (confusionRef.current) {
      confusionInstance.current = new Chart(confusionRef.current, {
        type: 'bar',
        data: {
          labels: ['True Positive', 'False Positive', 'True Negative', 'False Negative'],
          datasets: [{
            data: [9640, 220, 88200, 380],
            backgroundColor: ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b'],
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
            y: { grid: { color: 'var(--slate-100)' }, ticks: { font: { size: 11 } } },
          },
        },
      });
    }
    return () => { if (confusionInstance.current) confusionInstance.current.destroy(); };
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Model summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Models in Production', value: mlModels.filter(m => m.status === 'production').length, icon: Cpu, color: 'var(--success-600)' },
          { label: 'A/B Tests Running', value: mlModels.filter(m => m.status === 'a/b_testing').length, icon: BarChart3, color: 'var(--warning-600)' },
          { label: 'Best Accuracy', value: `${Math.max(...mlModels.map(m => m.accuracy))}%`, icon: Target, color: 'var(--primary-600)' },
          { label: 'Total Predictions', value: '5.7M', icon: Brain, color: 'var(--info-600)' },
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

      {/* Performance History Chart */}
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--slate-200)', padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Model Performance Over Time</h3>
        <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '16px' }}>Fraud Classifier v3.2 - Weekly Metrics</p>
        <div style={{ height: 260 }}><canvas ref={chartRef} /></div>
      </div>

      {/* Models Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Model List */}
        <div style={{
          background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--slate-200)', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Deployed Models</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mlModels.map(model => (
              <div key={model.id}
                onClick={() => setSelectedModel(model)}
                style={{
                  padding: '14px 20px', cursor: 'pointer',
                  borderBottom: '1px solid var(--slate-100)',
                  background: selectedModel.id === model.id ? 'var(--primary-50)' : 'white',
                  borderLeft: selectedModel.id === model.id ? '3px solid var(--primary-500)' : '3px solid transparent',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={e => { if (selectedModel.id !== model.id) e.currentTarget.style.background = 'var(--slate-50)'; }}
                onMouseLeave={e => { if (selectedModel.id !== model.id) e.currentTarget.style.background = 'white'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{model.name}</span>
                  <Badge status={model.status} />
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--slate-500)' }}>
                  <span>{model.type}</span>
                  <span>Acc: {model.accuracy}%</span>
                  <span>AUC: {model.auc}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Detail */}
        <div style={{
          background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--slate-200)', overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{selectedModel.name}</h3>
              <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>{selectedModel.id} • {selectedModel.type}</span>
            </div>
            <Badge status={selectedModel.status} size="md" />
          </div>
          <div style={{ padding: '20px' }}>
            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Accuracy', value: `${selectedModel.accuracy}%`, color: 'var(--primary-600)' },
                { label: 'Precision', value: `${selectedModel.precision}%`, color: 'var(--info-600)' },
                { label: 'Recall', value: `${selectedModel.recall}%`, color: 'var(--warning-600)' },
                { label: 'F1 Score', value: `${selectedModel.f1Score}%`, color: 'var(--success-600)' },
                { label: 'AUC-ROC', value: `${selectedModel.auc}%`, color: 'var(--primary-600)' },
                { label: 'Predictions', value: (selectedModel.predictions / 1000000).toFixed(1) + 'M', color: 'var(--slate-700)' },
              ].map(m => (
                <div key={m.label} style={{
                  padding: '12px', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--slate-500)', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: m.color, marginTop: '4px', fontFamily: 'monospace' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Last Trained */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)', fontSize: '13px' }}>
              <span style={{ color: 'var(--slate-500)' }}>Last Trained</span>
              <span style={{ fontWeight: 500 }}>{selectedModel.lastTrained}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--slate-100)', fontSize: '13px' }}>
              <span style={{ color: 'var(--slate-500)' }}>Model Type</span>
              <span style={{ fontWeight: 500 }}>{selectedModel.type}</span>
            </div>

            {/* Feature Importance */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Features</div>
              {[
                { name: 'transaction_amount', importance: 0.23 },
                { name: 'velocity_1hr', importance: 0.19 },
                { name: 'geo_risk_score', importance: 0.15 },
                { name: 'device_fingerprint', importance: 0.12 },
                { name: 'merchant_risk', importance: 0.09 },
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--slate-600)', width: '140px' }}>{f.name}</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--slate-100)', overflow: 'hidden' }}>
                    <div style={{ width: `${f.importance * 400}%`, height: '100%', borderRadius: 4, background: 'var(--primary-500)' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, width: '36px', textAlign: 'right' }}>{(f.importance * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button style={{
                flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                background: 'var(--primary-600)', color: 'white', border: 'none',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <RefreshCw size={14} /> Retrain
              </button>
              <button style={{
                flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--slate-200)', background: 'white', color: 'var(--slate-700)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <Eye size={14} /> View Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--slate-200)', padding: '20px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Prediction Distribution</h3>
        <p style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '16px' }}>Confusion matrix breakdown - last 30 days</p>
        <div style={{ height: 200 }}><canvas ref={confusionRef} /></div>
      </div>
    </div>
  );
};

export default MlModels;
