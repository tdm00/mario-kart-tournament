const db = require('../db');

// Add a new driver
const addDriver = (name, ageRange, skillLevel, callback) => {
  db.run(
    `INSERT INTO drivers (name, age_range, skill_level) VALUES (?, ?, ?)`,
    [name, ageRange, skillLevel],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// Get all drivers
const getDrivers = (callback) => {
  db.all(`SELECT * FROM drivers ORDER BY total_score DESC`, [], (err, rows) => {
    callback(err, rows);
  });
};

// Update a driver's score
const updateScore = (id, newScore, ageMultiplier, skillMultiplier, callback) => {
  db.get(`SELECT scores, total_score FROM drivers WHERE id = ?`, [id], (err, row) => {
    if (err) return callback(err);

    // Parse the existing scores
    const scores = JSON.parse(row.scores || '[]');
    const adjustedScore = newScore * ageMultiplier * skillMultiplier;
    scores.push(adjustedScore);

    // Update the scores and total
    const totalScore = scores.reduce((a, b) => a + b, 0);
    db.run(
      `UPDATE drivers SET scores = ?, total_score = ? WHERE id = ?`,
      [JSON.stringify(scores), totalScore, id],
      callback
    );
  });
};

module.exports = {
  addDriver,
  getDrivers,
  updateScore,
};