const db = require('./db');

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

// // Get all drivers
// const getDrivers = (callback) => {
//   db.all(`SELECT * FROM drivers ORDER BY total_score DESC`, [], (err, rows) => {
//     callback(err, rows);
//   });
// };

const getDrivers = (callback) => {
  db.all(`SELECT * FROM drivers`, [], (err, rows) => {
    callback(err, rows);
  });
};


// Get a driver by ID
const getDriverById = (id, callback) => {
  db.get(`SELECT * FROM drivers WHERE id = ?`, [id], (err, row) => {
    callback(err, row);
  });
};

// Update a driver's score
const updateScore = (id, totalScore, callback) => {
  db.run(
    `UPDATE drivers SET total_score = ? WHERE id = ?`,
    [parseFloat(totalScore), id],
    callback
  );
};


module.exports = {
  addDriver,
  getDrivers,
  getDriverById,
  updateScore,
};