const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models/db'); // Import the database
const { addDriver, getDrivers, getDriverById, updateScore } = require('../models/Driver');

// Default route for /admin
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login');
});

// Render login page
router.get('/login', (req, res) => {
  const errorMessage = req.flash('error')[0];
  res.render('admin/login', { errorMessage });
});

// Handle login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })
);

// Render admin dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
  getDrivers((err, drivers) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching drivers');
    }
    res.render('admin/dashboard', { drivers });
  });
});

// Render Add Driver page
router.get('/addDriver', isAuthenticated, (req, res) => {
  res.render('admin/addDriver');
});

// Handle Add Driver submission
router.post('/addDriver', isAuthenticated, (req, res) => {
  const { name, ageRange, skillLevel } = req.body;
  addDriver(name, ageRange, skillLevel, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding driver');
    }
    res.redirect('/admin/dashboard');
  });
});

// Render Edit Driver page
router.get('/editDriver/:id', isAuthenticated, (req, res) => {
  getDriverById(req.params.id, (err, driver) => {
    if (err || !driver) {
      console.error(err);
      return res.status(404).send('Driver not found');
    }
    res.render('admin/editDriver', { driver });
  });
});

// Handle Edit Driver submission
router.post('/editDriver/:id', isAuthenticated, (req, res) => {
  const { name, ageRange, skillLevel } = req.body;

  db.run(
    `UPDATE drivers SET name = ?, age_range = ?, skill_level = ? WHERE id = ?`,
    [name, ageRange, skillLevel, req.params.id],
    (err) => {
      if (err) {
        console.error('Error updating driver:', err);
        return res.status(500).send('Error updating driver');
      }
      res.redirect('/admin/dashboard');
    }
  );
});

// Render Enter Score page
router.get('/enterScore', isAuthenticated, (req, res) => {
  getDrivers((err, drivers) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching drivers');
    }
    res.render('admin/enterScore', { drivers });
  });
});

// Handle Enter Score submission
router.post('/enterScore', isAuthenticated, (req, res) => {
  const { driverId, score } = req.body;

  if (!driverId || !score) {
    return res.status(400).send('Driver ID and score are required');
  }

  getDriverById(driverId, (err, driver) => {
    if (err || !driver) {
      console.error(err);
      return res.status(404).send('Driver not found');
    }

    const ageMultiplier = getAgeMultiplier(driver.age_range);
    const skillMultiplier = getSkillMultiplier(driver.skill_level);

    updateScore(driverId, score, ageMultiplier, skillMultiplier, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating score');
      }
      res.redirect('/admin/dashboard');
    });
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/admin/login');
  });
});

router.get('/editScore/:id', isAuthenticated, (req, res) => {
  getDriverById(req.params.id, (err, driver) => {
    if (err || !driver) {
      console.error(err || 'Driver not found');
      return res.status(404).send('Driver not found');
    }
    res.render('admin/editScore', { driver });
  });
});

router.post('/editScore/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { totalScore } = req.body;

  if (!totalScore || isNaN(totalScore)) {
    return res.status(400).send('Invalid total score');
  }

  db.run(
    `UPDATE drivers SET total_score = ? WHERE id = ?`,
    [parseFloat(totalScore), id],
    (err) => {
      if (err) {
        console.error('Error updating score:', err);
        return res.status(500).send('Error updating score');
      }
      res.redirect('/admin/dashboard');
    }
  );
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
}

module.exports = router;