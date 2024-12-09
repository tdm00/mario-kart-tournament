const express = require('express');
const router = express.Router();
const db = require('../models/db');

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

// Spectator route with skill filtering
router.get('/', (req, res) => {
  const groupBy = req.query.groupBy;
  const skill = req.query.skill;

  db.all(`SELECT * FROM drivers ORDER BY total_score DESC`, [], (err, drivers) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching drivers');
    }

    // Filter drivers by skill level if the skill query parameter is present
    if (skill) {
      drivers = drivers.filter(driver => driver.skill_level === skill);
    }
    // Group drivers if requested
    else if (groupBy === 'skill') {
      drivers = groupByField(drivers, 'skill_level');
    } else if (groupBy === 'age') {
      drivers = groupByField(drivers, 'age_range');
    }

    res.render('spectator', { drivers, selectedSkill: skill }); // Pass selectedSkill to the view
  });
});

module.exports = router;