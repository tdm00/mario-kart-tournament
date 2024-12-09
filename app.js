// Load environment variables
require('dotenv').config();

// Validate critical environment variables
if (!process.env.ADMIN_PASSWORD) {
  console.error('ERROR: ADMIN_PASSWORD environment variable is not set.');
  process.exit(1); // Stop the application
}


// Import required modules
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session and flash messaging
app.use(
  session({
    secret: 'mario-kart-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Passport authentication setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/admin', adminRoutes);
app.use('/spectator', spectatorRoutes); // Register the /spectator route
app.use('/', spectatorRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));