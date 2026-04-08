import React from 'react';
export default function StatusBar({ connected, decision, snapshot }) {
  const mode = decision?.mode ?? 'WAITING';
  const modeColors = {
    NORMAL: { bg: '#0d2e1a', color: '#4ade80', border: '#22c55e' },
    EMERGENCY: { bg: '#2e1500', color: '#fb923c', border: '#f59e0b' },
    WAITING: { bg: '#1a1d27', color: '#64748b', border: '#2d3348' },
  };
  const mc = modeColors[mode] || modeColors.WAITING;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#13161f', border: '1px solid #1e2433',
      borderRadius: 10, padding: '10px 20px', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>

      {/* Connection status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%',
          background: connected ? '#22c55e' : '#ef4444',
          boxShadow: connected ? '0 0 6px #22c55e' : 'none' }}/>
        <span style={{ fontSize: 13, color: connected ? '#4ade80' : '#f87171' }}>
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      {/* Intersection ID */}
      <div style={{ fontSize: 13, color: '#64748b' }}>
        Intersection: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
          {snapshot?.intersection_id ?? '—'}
        </span>
      </div>

      {/* Mode badge */}
      <div style={{ background: mc.bg, border: `1px solid ${mc.border}`,
        color: mc.color, fontSize: 12, fontWeight: 700,
        padding: '4px 12px', borderRadius: 99, letterSpacing: 1 }}>
        MODE: {mode}
      </div>

      {/* Last update */}
      <div style={{ fontSize: 12, color: '#475569' }}>
        Last update: {snapshot?.timestamp
          ? new Date(snapshot.timestamp).toLocaleTimeString()
          : '—'}
      </div>
    </div>
  );
}