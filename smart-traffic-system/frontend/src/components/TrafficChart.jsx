import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = { north: '#22c55e', south: '#3b82f6', east: '#f59e0b', west: '#ec4899' };

export default function TrafficChart({ history }) {
  if (!history.length) {
    return (
      <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>
        Waiting for data...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
        <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} interval="preserveStartEnd"/>
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }}/>
        <Tooltip
          contentStyle={{ background: '#1a1d27', border: '1px solid #2d3348',
            borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}/>
        {['north','south','east','west'].map(lane => (
          <Line key={lane} type="monotone" dataKey={lane}
            stroke={COLORS[lane]} strokeWidth={2} dot={false}
            activeDot={{ r: 4 }}/>
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}