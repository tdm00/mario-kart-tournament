const express = require('express');
const router = express.Router();
const { getDrivers } = require('../models/Driver');

// Display leaderboard
router.get('/', (req, res) => {
  getDrivers((err, drivers) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching drivers');
    } else {
      res.render('spectator', { drivers });
    }
  });
});

module.exports = router;