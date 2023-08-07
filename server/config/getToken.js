require('dotenv').config();
const { google } = require('googleapis');

//Creating authentication client
const client = new google.auth.OAuth2(process.env.googleClientId,process.env.googleClientSecret,"http://localhost:3001/auth/google/callback");
module.exports = async (req, res, next) => {
    var fullUrl = req.originalUrl;
    console.log(fullUrl);
    let code = new URLSearchParams(fullUrl).get('/auth/google/callback?code');
     client.getToken(code,(err,res)=>{
     });
    
    res.send("error");

}

 
module.exports = async (req, res, next) => {
    try {
         
        // Extracting the code parameter directly from the query
        const code = req.query.code;
        
        if (!code) {
            return res.status(400).send("No code provided");
        }

 
        client.getToken(code, (err, tokenResponse) => {
            if (err) {
                console.error("Error getting token: ", err);
                return res.status(500).send("Error getting token");
            }

            console.log(tokenResponse);

            // TODO: Store the tokenResponse or use it to access user's Google information
            // Then possibly redirect the user to another page or respond with success

            res.redirect('/your-success-page');
        });
    } catch (error) {
        console.error("Unexpected error: ", error);
        res.status(500).send("Unexpected error");
    }
};
