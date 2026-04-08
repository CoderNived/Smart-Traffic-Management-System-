const TrafficSnapshot = require('../models/TrafficSnapshot');
const { calculateSignalTimings } = require('../services/decisionEngine');

const saveSnapshot = async (req, res) => {
  try {
    const { intersection_id, timestamp, lanes } = req.body;

    if (!intersection_id || !lanes) {
      return res.status(400).json({ success: false, message: 'intersection_id and lanes are required' });
    }

    // Save raw snapshot to MongoDB
    const snapshot = new TrafficSnapshot({ intersection_id, timestamp: timestamp || Date.now(), lanes });
    const saved = await snapshot.save();

    // ── Run Decision Engine ───────────────────────────────────
    const decision = calculateSignalTimings(saved);

    // ── Broadcast to all connected React clients ──────────────
    const io = req.app.get('io');
    if (io) {
      io.emit('traffic_update', {
        snapshot: saved,
        decision
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Snapshot saved and broadcast',
      data: saved,
      decision
    });

  } catch (error) {
    console.error('❌ Error saving snapshot:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

const getAllSnapshots = async (req, res) => {
  try {
    const snapshots = await TrafficSnapshot.find().sort({ timestamp: -1 }).limit(20);
    return res.status(200).json({ success: true, count: snapshots.length, data: snapshots });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = { saveSnapshot, getAllSnapshots };