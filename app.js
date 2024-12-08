require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');

// Import routes
const adminRoutes = require('./routes/admin');
const spectatorRoutes = require('./routes/spectator');

// Initialize the app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parse form data
app.use(bodyParser.json()); // Parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session and flash messaging
app.use(
  session({
    secret: 'mario-kart-secret', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Passport authentication setup
require('./config/passport')(passport); // Load Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/admin', adminRoutes); // Admin routes
app.use('/', spectatorRoutes); // Spectator routes

// Error handling
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});