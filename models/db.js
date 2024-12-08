const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mario_kart.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');

    db.run(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age_range TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        scores TEXT DEFAULT '[]',
        total_score REAL DEFAULT 0
      )
    `);
  }
});

module.exports = db;