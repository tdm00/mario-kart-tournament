const express = require('express');
const router = express.Router();
const passport = require('passport');
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

// Render Edit Score page
router.get('/editScore/:id', isAuthenticated, (req, res) => {
  getDriverById(req.params.id, (err, driver) => {
    if (err || !driver) {
      console.error(err);
      return res.status(404).send('Driver not found');
    }
    res.render('admin/editScore', { driver });
  });
});

// Handle Edit Score submission
router.post('/editScore/:id', isAuthenticated, (req, res) => {
  const { score } = req.body;

  const ageMultiplier = getAgeMultiplier(req.body.ageRange || '26+');
  const skillMultiplier = getSkillMultiplier(req.body.skillLevel || 'Expert');

  updateScore(req.params.id, score, ageMultiplier, skillMultiplier, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating score');
    }
    res.redirect('/admin/dashboard');
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

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
}

function getAgeMultiplier(ageRange) {
  const multipliers = { '5-8': 1.5, '9-11': 1.4, '12-15': 1.3, '16-20': 1.2, '21-25': 1.1, '26+': 1.0 };
  return multipliers[ageRange] || 1.0;
}

function getSkillMultiplier(skillLevel) {
  const multipliers = { Beginner: 1.3, Intermediate: 1.2, Advanced: 1.1, Expert: 1.0 };
  return multipliers[skillLevel] || 1.0;
}

module.exports = router;