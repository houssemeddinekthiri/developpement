let passport = require("passport");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
require('dotenv').config();

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