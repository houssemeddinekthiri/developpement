
//This file contains all the api routes of the application except the authentication calls.
//The route for authentication api call are listed in ./auth.js 
let express = require('express');
let router = express.Router();
let documentController = require("../controllers/documentController");
let userController = require("../controllers/userController");

router.get('', function (req, res) {
    console.log(req.cookies.JWT);
    res.send('api works');
});
router.get('/documents', documentController.getUserDocuments);
router.post('/documents', documentController.uploadDocument);
router.post('/documents/verify', documentController.verifyDocument);
router.post('/documents/drive/:id', documentController.uploadDocumentFromDrive);
router.post('/documents/:id/signers', documentController.addSigners);
router.post('/documents/:id/email', documentController.sendEmail);
router.get('/documents/:id/comments', documentController.getComments);
router.post('/documents/:id/comments', documentController.postComment);
router.post('/documents/:id/sign', documentController.sigDocument);
router.post('/documents/:id/reject', documentController.rejectDocument);
router.get('/documents/:id/status', documentController.getStatus);

router.get('/documents/:id', documentController.getDocment);
router.post('/users/uploadsignature', userController.uploadSignature);
router.post('/users/defaultsignature', userController.setDefaultSignature);
router.get('/users/frontpageanalytics',userController.getFrontPageAnalytics);
router.get('/users/getsignatures', userController.getSignatures);
router.get('/users/analytics' , userController.analytics)
router.get('/users/accesstoken', userController.getAccessToken);
router.post('/users/storekeys', userController.storeKeys);
router.get('/users/getkeys', userController.getKeys);
router.get('/users/getkeystatus', userController.getKeyStatus);

router.get('/users', userController.getUserNamesList);
module.exports = router;