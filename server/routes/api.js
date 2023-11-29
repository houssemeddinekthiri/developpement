const express = require('express');

const Document = require('../models/document');
const { PDFDocument, Binary } = require('pdf-lib');
const fs = require('fs');
const sha512 = require('js-sha512');
//This file contains all the api routes of the application except the authentication calls.
//The route for authentication api call are listed in ./auth.js

let router = express.Router();
let documentController = require("../controllers/documentController");
let userController = require("../controllers/userController");
 const { auth } = require('google-auth-library');

router.get('', function (req, res) {

    console.log(req.cookies.JWT);
    res.send('api works');
});
router.get('/documents', documentController.getUserDocuments);
router.post('/documents', documentController.uploadDocument);


router.post('/documents/:id/add', documentController.addBufferById);
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
router.post('/users/uploadTampon', userController.uploadTampon);
router.post('/users/defaultsignature', userController.setDefaultSignature);
router.get('/users/frontpageanalytics',userController.getFrontPageAnalytics);
router.get('/users/getsignatures', userController.getSignatures);
router.get('/users/getTampon', userController.getTampon);
router.get('/users/analytics' , userController.analytics)
router.get('/users/accesstoken', userController.getAccessToken);
router.post('/users/storekeys', userController.storeKeys);
router.get('/users/getkeys', userController.getKeys);
router.get('/users/getkeystatus', userController.getKeyStatus);

router.get('/users', userController.getUserNamesList);
router.post('/signup', userController.signup);

router.post('/login', userController.login);


  router.get("/searchDocument/:key", async (req, resp) => {
    let data = await Document.find({

        "$or": [
            { name: { $regex: req.params.key } },



        ]
    })
    resp.send(data);
  })

  router.post('/documents/:id/add-positions', async (req, res) => {
    try {
      const documentId = req.params.id;
      const { positions } = req.body;
      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }


      document.positions = positions;

      await document.save();

      res.status(200).json({ message: 'Positions ajoutées avec succès au document' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.post('/documents/:documentId/Add_signers', async (req, res) => {
    try {
      const documentId = req.params.documentId;
      const signerDetails = req.body.signers;


      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({ message: 'Document introuvable' });
      }


      document.signers=signerDetails;

      document.status = 'sent';
      await document.save();

      res.status(200).json({ message: 'Signataire ajouté avec succès au document' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du signataire au document : ', error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du signataire' });
    }
  });

  router.get('/documents/:documentId/positions', async (req, res) => {
    try {
      const documentId = req.params.documentId;

      const document = await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({ message: 'Document non trouvé' });
      }

      const positions = document.positions;

      res.json(positions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la récupération des positions' });
    }
  });




  module.exports = router;



