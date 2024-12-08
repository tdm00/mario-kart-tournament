const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Hardcoded credentials for simplicity
      const adminUsername = 'admin';
      const adminPassword = 'letmein';

      if (username !== adminUsername) {
        return done(null, false, { message: 'Incorrect username' });
      }

      if (password !== adminPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, { username: adminUsername });
    })
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  // Deserialize user
  passport.deserializeUser((username, done) => {
    done(null, { username });
  });
};