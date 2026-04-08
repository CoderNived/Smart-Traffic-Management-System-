import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function useTrafficSocket() {
  const [snapshot, setSnapshot] = useState(null);
  const [decision, setDecision] = useState(null);
  const [history, setHistory] = useState([]);   // last 20 updates for chart
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Initial data load on connect
    socket.on('initial_data', (data) => {
      if (data.length > 0) {
        setSnapshot(data[0]);
      }
    });

    // Live updates from simulator
    socket.on('traffic_update', (data) => {
      setSnapshot(data.snapshot);
      setDecision(data.decision);

      // Keep rolling history of last 20 snapshots for the chart
      setHistory(prev => {
        const entry = {
          time: new Date(data.snapshot.timestamp).toLocaleTimeString(),
          north: data.snapshot.lanes.north.vehicle_count,
          south: data.snapshot.lanes.south.vehicle_count,
          east:  data.snapshot.lanes.east.vehicle_count,
          west:  data.snapshot.lanes.west.vehicle_count,
        };
        const updated = [...prev, entry];
        return updated.slice(-20); // keep last 20
      });
    });

    return () => socket.disconnect();
  }, []);

  return { snapshot, decision, history, connected };
}