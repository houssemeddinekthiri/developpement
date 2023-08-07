require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

//Creating authentication client
const client = new OAuth2Client(process.env.googleClientId);


//utility function to verify if the token sent from client is valid or not.
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.googleClientId,

    }).catch(e => { return null });
    if (ticket) {
        const payload = ticket.getPayload();
        return payload;
    }

}


//Authorization middleware to protect the api, any api call should pass through this middleware 
//except the authentication calls
module.exports = (req, res, next) => {
    const token = req.cookies.JWT;
    verify(token).then((data) => {
        if (data) {
            next();
        }
        else {
            res.status(401).json({ error: "unauthorized_access" });
        }
    })
}


function auth(req, res, next) {
  // Get the authentication token from the request headers
  const token = req.header('Authorization');

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token using the secret key used during token generation
    const decoded = jwt.verify(token, 'your_secret_key');

    // Add the user object to the request for further processing, if needed
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

 
module.exports = auth;

