const express = require('express');
const router = express.Router();
const { saveSnapshot, getAllSnapshots } = require('../controllers/trafficController');

// POST /api/traffic  → receive and save a snapshot
router.post('/', saveSnapshot);

// GET  /api/traffic  → retrieve recent snapshots
router.get('/', getAllSnapshots);

module.exports = router;