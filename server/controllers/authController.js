const User = require('../models/user');
const passport = require("passport");
const {google} = require('googleapis');



 exports.user_signin=passport.authenticate('google', { scope: ["profile", "email","https://www.googleapis.com/auth/drive.file"] })
// exports.user_signin = async(req,res,next) =>{
//   authorize(res)
// }
function authorize(res) {
  const client_id  = process.env.googleClientId;
  const client_secret =process.env.googleClientSecret;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, "http://localhost:3001/auth/google/callback");
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"],
  });
  res.redirect(authUrl);
    
  
}


exports.google_callback =async function(req,res,next){
  
    var query = { email: req.user.email },
      update = { email: req.user.email, name: req.user.name,image:req.user.image },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
     
    User.findOneAndUpdate(query, update, options, function (error, result) {
      if (error) {
        console.log(error);
        res.status(500).json({message:'Server Error'});
      }
      else {
        res.cookie('JWT', req.user.token, {
          maxAge: 3600_000,
          httpOnly: true
        });

        res.cookie('access_token', req.user.accessToken, {
          maxAge: 3600_000,
          httpOnly: true
        });
        res.cookie('name', req.user.name, {
          maxAge: 3600_000,
        });

        res.cookie('email', req.user.email, {
          maxAge: 3600_000,
        });
        res.cookie('id', req.user.token.split('.')[1], {
          maxAge: 3600_000,
        });
        
        res.redirect("http://localhost:3000");
      }

    });

  
}

exports.logout = (req,res,next)=>{
  res.clearCookie('acess_token');
  res.clearCookie('JWT');
  res.clearCookie('name');
  res.clearCookie('email');
  res.clearCookie('id');
  res.status(200).json({message:'ok'});
}
