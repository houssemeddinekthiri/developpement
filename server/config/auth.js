require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');

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
