import React from 'react';
import { useTrafficSocket } from './hooks/useTrafficSocket';
import SignalCard from './components/SignalCard';
import TrafficChart from './components/TrafficChart';
import StatusBar from './components/StatusBar';

const LANES = ['north', 'south', 'east', 'west'];

export default function App() {
  const { snapshot, decision, history, connected } = useTrafficSocket();

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
          🚦 Smart Traffic Management
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
          AI-driven adaptive signal control — live dashboard
        </p>
      </div>

      {/* Status bar */}
      <StatusBar connected={connected} decision={decision} snapshot={snapshot}/>

      {/* Signal cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 32 }}>
        {LANES.map(lane => (
          <SignalCard
            key={lane}
            lane={lane}
            laneData={snapshot?.lanes?.[lane]}
            timing={decision?.timings?.[lane]}
          />
        ))}
      </div>

      {/* Chart section */}
      <div style={{ background: '#13161f', border: '1px solid #1e2433',
        borderRadius: 12, padding: '20px 16px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#94a3b8' }}>
          Vehicle Count — Live Feed
        </h2>
        <TrafficChart history={history}/>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #22c55e; }
          50% { opacity: 0.6; box-shadow: 0 0 16px #22c55e; }
        }
      `}</style>
    </div>
  );
}