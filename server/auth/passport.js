const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require("../database/db");

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const query = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [username]
      };
      const result = await pool.query(query);
      const user = result.rows[0];

      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (username, done) => {
  try {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    };
    const result = await pool.query(query);
    const user = result.rows[0];
    
    if (!user) {
      return done(null, false);
    }
    
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
