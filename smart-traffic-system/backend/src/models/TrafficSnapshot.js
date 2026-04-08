const mongoose = require('mongoose');

// ─── Lane Sub-Schema ──────────────────────────────────────────
// Describes the structure of a single lane (north/south/east/west)
const LaneSchema = new mongoose.Schema({
  vehicle_count: {
    type: Number,
    required: true,
    min: 0           // vehicle count can never be negative
  },
  signal_state: {
    type: String,
    enum: ['red', 'green', 'yellow'],  // only these 3 values are valid
    required: true
  },
  emergency: {
    type: Boolean,
    default: false
  }
}, { _id: false }); // _id: false — we don't need a separate ID for each lane

// ─── Main Snapshot Schema ─────────────────────────────────────
const TrafficSnapshotSchema = new mongoose.Schema({
  intersection_id: {
    type: String,
    required: true,
    trim: true        // removes accidental whitespace
  },
  timestamp: {
    type: Date,
    default: Date.now // auto-fills if not provided
  },
  lanes: {
    north: { type: LaneSchema, required: true },
    south: { type: LaneSchema, required: true },
    east:  { type: LaneSchema, required: true },
    west:  { type: LaneSchema, required: true }
  }
});

// ─── Export the Model ─────────────────────────────────────────
module.exports = mongoose.model('TrafficSnapshot', TrafficSnapshotSchema);