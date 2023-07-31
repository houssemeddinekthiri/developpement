require('dotenv').config();
const { google } = require('googleapis');

//Creating authentication client
const client = new google.auth.OAuth2(process.env.googleClientId,process.env.googleClientSecret,"http://localhost:3001/auth/google/callback");
module.exports = async (req, res, next) => {
    var fullUrl = req.originalUrl;
    console.log(fullUrl);
    let code = new URLSearchParams(fullUrl).get('/auth/google/callback?code');
    console.log(code);
    client.getToken(code,(err,res)=>{
        console.log(res);
    });
    
    res.send("error");

}