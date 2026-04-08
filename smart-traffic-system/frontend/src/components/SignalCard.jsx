import React from 'react';
const SIGNAL_COLORS = {
  green:  { bg: '#0d2e1a', border: '#22c55e', dot: '#22c55e', label: '#4ade80' },
  red:    { bg: '#2e0d0d', border: '#ef4444', dot: '#ef4444', label: '#f87171' },
  yellow: { bg: '#2e2300', border: '#eab308', dot: '#eab308', label: '#facc15' },
};

const LANE_ICONS = { north: '↑', south: '↓', east: '→', west: '←' };

export default function SignalCard({ lane, laneData, timing }) {
  const signal = timing?.signal_state || laneData?.signal_state || 'red';
  const colors = SIGNAL_COLORS[signal];
  const greenTime = timing?.green_time ?? '—';
  const isEmergency = laneData?.emergency;

  return (
    <div style={{
      background: colors.bg,
      border: `1.5px solid ${isEmergency ? '#f59e0b' : colors.border}`,
      borderRadius: 12,
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
      transition: 'all 0.4s ease',
      boxShadow: `0 0 ${signal === 'green' ? '16px' : '4px'} ${colors.border}44`
    }}>

      {/* Emergency Badge */}
      {isEmergency && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#f59e0b', color: '#1a1000',
          fontSize: 10, fontWeight: 700, padding: '2px 7px',
          borderRadius: 99, letterSpacing: 0.5
        }}>
          🚨 EMERGENCY
        </div>
      )}

      {/* Lane label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{LANE_ICONS[lane]}</span>
        <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 1, color: '#94a3b8' }}>
          {lane}
        </span>
      </div>

      {/* Signal dot + state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: colors.dot,
          boxShadow: `0 0 8px ${colors.dot}`,
          animation: signal === 'green' ? 'pulse 1.4s infinite' : 'none'
        }}/>
        <span style={{ fontSize: 15, fontWeight: 700, color: colors.label,
          textTransform: 'uppercase', letterSpacing: 1 }}>
          {signal}
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        background: '#ffffff08', borderRadius: 8, padding: '10px 12px' }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Vehicles</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{laneData?.vehicle_count ?? '—'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Green time</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#4ade80' }}>{greenTime}s</div>
        </div>
      </div>

      {/* Reason tag */}
      {timing?.reason && (
        <div style={{ fontSize: 10, color: '#475569', textAlign: 'center',
          background: '#ffffff06', borderRadius: 6, padding: '3px 8px' }}>
          {timing.reason.replace(/_/g, ' ')}
        </div>
      )}
    </div>
  );
}