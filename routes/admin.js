const express = require('express');
const router = express.Router();
const { addDriver, getDrivers, updateScore } = require('../models/Driver');
const passport = require('passport');


// Render login page
router.get('/login', (req, res) => {
    const errorMessage = req.flash('error')[0]; // Flash message for login errors
    res.render('admin/login', { errorMessage });
  });

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true,
  })
);


// Get drivers for dashboard
router.get('/dashboard', (req, res) => {
    getDrivers((err, drivers) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching drivers');
      } else {
        res.render('admin/dashboard', { drivers });
      }
    });
  });


// Add driver
router.post('/addDriver', (req, res) => {
    const { name, ageRange, skillLevel } = req.body;
    addDriver(name, ageRange, skillLevel, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding driver');
      } else {
        res.redirect('/admin/dashboard');
      }
    });
  });
  

// Update score
router.post('/enterScore', (req, res) => {
    const { driverId, score } = req.body;
  
    // Age and skill multipliers
    const ageMultiplier = getAgeMultiplier(req.body.ageRange);
    const skillMultiplier = getSkillMultiplier(req.body.skillLevel);
  
    updateScore(driverId, score, ageMultiplier, skillMultiplier, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating score');
      } else {
        res.redirect('/admin/dashboard');
      }
    });
  });

  
// Helper functions for multipliers
function getAgeMultiplier(ageRange) {
    const multipliers = { '5-8': 1.5, '9-11': 1.4, '12-15': 1.3, '16-20': 1.2, '21-25': 1.1, '26+': 1.0 };
    return multipliers[ageRange] || 1.0;
  }
  
  function getSkillMultiplier(skillLevel) {
    const multipliers = { Beginner: 1.3, Intermediate: 1.2, Advanced: 1.1, Expert: 1.0 };
    return multipliers[skillLevel] || 1.0;
  }

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/admin/login');
}

module.exports = router;