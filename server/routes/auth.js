/* This file contains the contains the api calls related to google authentication
*/

const express = require('express');
const passport = require("passport");
const auth = require('../config/auth');
const router = express.Router();
const authController = require('../controllers/authController');


router.get("/google",authController.user_signin);
router.get("/google/callback",  passport.authenticate("google", { failureRedirect: "/", session: false }),authController.google_callback);
router.get('/loginstatus',auth,(req,res,next)=>{res.status(200).json({message:'ok'})});
router.post('/logout',authController.logout);


module.exports =router;