// auth/passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Assuming the user model is in the parent directory

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // If the user does not exist or the password is incorrect, authentication fails
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // If the user and password are valid, return the user object
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize and deserialize the user for sessions (you can customize these functions as needed)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
