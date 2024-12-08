const express = require('express');
const router = express.Router();
const { getDrivers } = require('../models/Driver');

router.get('/', (req, res) => {
  const groupBy = req.query.groupBy;

  getDrivers((err, drivers) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching drivers');
    }

    // Sort drivers by score (highest to lowest)
    drivers.sort((a, b) => b.total_score - a.total_score);

    // Group drivers if requested
    if (groupBy === 'skill') {
      drivers = groupByField(drivers, 'skill_level');
    } else if (groupBy === 'age') {
      drivers = groupByField(drivers, 'age_range');
    }

    res.render('spectator', { drivers });
  });
});

// Helper function to group drivers by a field
function groupByField(drivers, field) {
  const grouped = {};
  drivers.forEach((driver) => {
    if (!grouped[driver[field]]) {
      grouped[driver[field]] = [];
    }
    grouped[driver[field]].push(driver);
  });

  // Flatten grouped results for rendering
  const result = [];
  Object.keys(grouped).forEach((key) => {
    result.push({ name: `Group: ${key}`, skill_level: '', age_range: '', total_score: '' });
    result.push(...grouped[key]);
  });
  return result;
}

module.exports = router;