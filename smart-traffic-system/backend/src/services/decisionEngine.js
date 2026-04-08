// ─── Signal Timing Decision Engine ───────────────────────────
// Takes a traffic snapshot, returns optimized signal timings

const TOTAL_CYCLE_TIME = 60; // seconds per full cycle
const MIN_GREEN_TIME = 5;    // no lane gets less than 5s

function calculateSignalTimings(snapshot) {
  const { lanes, intersection_id } = snapshot;
  const laneNames = Object.keys(lanes);

  // ── Emergency Override ────────────────────────────────────
  // If any lane has an emergency vehicle, it gets full green immediately
  const emergencyLane = laneNames.find(lane => lanes[lane].emergency);
  if (emergencyLane) {
    const result = {};
    laneNames.forEach(lane => {
      result[lane] = {
        signal_state: lane === emergencyLane ? 'green' : 'red',
        green_time: lane === emergencyLane ? TOTAL_CYCLE_TIME : 0,
        vehicle_count: lanes[lane].vehicle_count,
        emergency: lanes[lane].emergency,
        reason: lane === emergencyLane ? 'EMERGENCY_OVERRIDE' : 'YIELD_TO_EMERGENCY'
      };
    });
    return {
      intersection_id,
      timestamp: new Date().toISOString(),
      mode: 'EMERGENCY',
      timings: result
    };
  }

  // ── Normal Mode — Proportional Allocation ─────────────────
  const totalVehicles = laneNames.reduce(
    (sum, lane) => sum + lanes[lane].vehicle_count, 0
  );

  const timings = {};

  if (totalVehicles === 0) {
    // Edge case: no vehicles — split equally
    laneNames.forEach(lane => {
      timings[lane] = {
        signal_state: 'red',
        green_time: TOTAL_CYCLE_TIME / laneNames.length,
        vehicle_count: 0,
        emergency: false,
        reason: 'NO_TRAFFIC_EQUAL_SPLIT'
      };
    });
  } else {
    // Calculate proportional green time for each lane
    let maxTime = 0;
    let maxLane = laneNames[0];

    laneNames.forEach(lane => {
      const proportion = lanes[lane].vehicle_count / totalVehicles;
      const rawTime = proportion * TOTAL_CYCLE_TIME;
      const green_time = Math.max(rawTime, MIN_GREEN_TIME); // enforce minimum

      timings[lane] = {
        signal_state: 'red', // will update the busiest lane below
        green_time: Math.round(green_time),
        vehicle_count: lanes[lane].vehicle_count,
        emergency: false,
        reason: 'PROPORTIONAL'
      };

      if (lanes[lane].vehicle_count > maxTime) {
        maxTime = lanes[lane].vehicle_count;
        maxLane = lane;
      }
    });

    // The busiest lane is currently green in this snapshot
    timings[maxLane].signal_state = 'green';
  }

  return {
    intersection_id,
    timestamp: new Date().toISOString(),
    mode: 'NORMAL',
    timings
  };
}

module.exports = { calculateSignalTimings };