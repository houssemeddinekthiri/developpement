let passport = require("passport");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require('dotenv').config();
 const bcrypt = require('bcryptjs');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

 
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});
passport.use(
 new GoogleStrategy(
  {
   clientID: process.env.googleClientId,

   clientSecret: process.env.googleClientSecret,
   callbackURL: "http://localhost:3001/auth/google/callback",
   accessType:"offline",
  },
  function(accessToken, refreshToken,id_token ,profile, done) {
   let userData = {
    email: profile.emails[0].value,
    name: profile.displayName,
    token: id_token.id_token,
    accessToken:accessToken,
    refreshToken:refreshToken,
    image:profile._json.picture
   };
   done(null, userData);
  }
 )
);




passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  } catch (err) {
    return done(err);
  }
}));

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
