const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')
const { google } = require('googleapis');
const fs = require('fs');
const nodemailer = require('nodemailer');
const Binary = require('mongodb').Binary;
const Document = require('../models/document');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const Agenda = require('agenda');
const moment = require('moment');
const Jimp = require("jimp")
var sha512 = require('js-sha512');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const { body, validationResult, sanitizeBody } = require("express-validator");
const { Console } = require('console');
require('dotenv').config();
const mongoConnectionString = process.env.DB;
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const client = new google.auth.OAuth2(process.env.googleClientId, process.env.googleClientSecret, "http://localhost:3001/auth/google/callback");
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "smartdoc36@gmail.com",
        pass: "vqelrjlirkrkcvis"


    }
  });


//Utitlity function to retrieve email from the JWT.
function getEmail(req, res) {
   if (!req.cookies.JWT) {
    res.status(401).json({ error: "user not found" });
    return null;
  } else {
    let buff = Buffer.from(req.cookies.JWT.split(".")[1], "base64");
    let text = buff.toString("ascii");
    let email = req.cookies.email;

    return  email;
  }
}
//returns the list of documents owned by the user and the documents shared by others to the user
exports.getUserDocuments = (req, res, next) => {
    let email = getEmail(req, res);
     User.findOne({ 'email': email }, { ownerdDocuments: 1, sharedDocuments: 1 }).populate('ownedDocuments', { buffer: 0 }).populate('sharedDocuments', { buffer: 0 }).exec((err, resp) => {
        if (err) {
            res.status(401).json({ error: "user not found" })
        }
        else {
            res.status(200).json({
                ownedDocuments: resp.ownedDocuments,
                sharedDocuments: resp.sharedDocuments.filter((document) => document.status === 'sent')
            });
        }
    })
}

exports.uploadDocument = async (req, res, next) => {
    let email = getEmail(req, res);
    let document = req.files.doc;
    let documentPath = document.tempFilePath;
    let documentBufferData = fs.readFileSync(documentPath);
    let documentData = {};

    documentData.buffer = Binary(documentBufferData);
    documentData.name = req.files.doc.name;
    documentData.description = req.body.description;
    documentData.owner = getEmail(req);
    documentData.timeline = [{ action: 'created', time: new Date(), email: email }];
    documentData.status = 'uploaded';
    try {

        let document = await Document.create(documentData);
        let pdfDoc = await PDFDocument.load(document.buffer);
        pdfDoc.setKeywords([document._id]);
        let pdfBytes = await pdfDoc.save();
        document.buffer = Binary(pdfBytes);
         document.lastModifiedHash = sha512(pdfBytes);
        await document.save();
        let user = await User.findOne({ 'email': email }).exec();
        user.ownedDocuments.push(document._id);
        await user.save();
        res.status(200).json({ _id: document._id });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }

}



exports.addSigners = async (req, res, next) => {
    let signers = req.body.signers;
    let documentId = req.params.id;
    let isOwnerSigner = false;
    let sequential = req.body.sequential;
    try {
        for (let i = 0; i < signers.length; i++) {
            signer = signers[i];
            agenda.define("set_document_expired", async (job) => {
                let document = await Document.findById(job.attrs.data.documentId, { signers: 1, timeline: 1, status: 1 }).exec();
                let signers = document.signers;
                let timeline = document.timeline;

                signers.forEach((signer, index) => {
                    if (signer.email === job.attrs.data.email && signer.status==='waiting' )
                    {
                        signers[index].status = 'expired';
                        timeline.push({ action: 'expired', time: new Date(), email: job.attrs.data.email });
                        document.timeline = timeline;
                        document.signers = signers;


                    }
                })
                await document.save();

            });
            (async function () {

                var date = moment(signer.deadline).format();
                agenda.start();
                agenda.schedule(date, 'set_document_expired', { documentId: documentId, email: signer.email });

            })();

            let user = await User.findOne({ 'email': signer.email }).exec();
            if (!user) {
                let newUser = new User({ email: signer.email, signedUp: false });
                await newUser.save();
                user = newUser;
            }

            if (user.ownedDocuments.includes(documentId)) {
                isOwnerSigner = true;
            }

            user.sharedDocuments.push(documentId);
            await user.save();

        };
        let document = await Document.findById(documentId, { buffer: 0 }).exec();
        if (sequential) {
            signers.forEach((signer, index) => {
                signer = { ...signer, order: index };
                signers[index] = signer;
            })
        }
        else {
            signers.forEach((signer, index) => {
                signer = { ...signer, order: 0 };
                signers[index] = signer;
            })

        }
        document.signers = signers;
        document.sequential = sequential;
         document.isOwnerSigner = isOwnerSigner;
        document.status = 'added_signers';
        await document.save();
        res.status(200).json({ message: 'ok' });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}

exports.uploadDocumentFromDrive = async (req, res, next) => {

    let fileId = req.params.id;
    let access_token = req.cookies.access_token;

    client.credentials = { access_token: access_token };
    const drive = google.drive({ version: 'v3', auth: client });
    let tempFilePath = "/tmp/" + uuidv4() + ".pdf";

    fs.appendFile(tempFilePath, null, (err, resp) => {
        if (err) {
            res.status(500).json({ err: "Internal Server Error" });
        }
        else {

            let temp = fs.createWriteStream(tempFilePath);


            drive.files.get({ fileId: fileId, alt: "media" }, { responseType: "stream" },
                function (err, resp) {

                    resp.data.on("end", () => {

                        let file = fs.createReadStream(tempFilePath);
                        res.status(200);
                        res.writeHead(200, { 'Content-disposition': 'attachment; filename=demo.pdf' });
                        file.pipe(res);

                    })
                        .on("error", err => {

                            res.status(500).json({ err: "Internal Server Error" });

                        })
                        .pipe(temp);
                });
        }
    });

};

exports.sendEmail = async (req, res, next) => {
     try {

        let fileId = req.params.id;
        let document = await Document.findById(fileId, { signers: 1, status: 1 });
        document.status = 'sent';
        await document.save();
        let signers = document.signers;
        let mailOptions;
         for (let index = 0; index < signers.length; index++) {
            mailOptions = {
                from: process.env.EMAIL,
                to: signers[index].email,
                subject: req.body.subject,
                text: req.body.body
            };

            await mailTransporter.sendMail(mailOptions);

        }


        res.status(200).json({ message: 'ok' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Internal Server Error" });

    }

};


exports.getDocment = async (req, res, next) => {
    try {

        let documentId = req.params.id;
        let document = await Document.findById(documentId).exec();
        let email = getEmail(req, res);
        let signers = document.signers;
        let isUserSigner = (signers.filter((signer) => (signer.email === email)).length !== 0)
        let isUserOwner = (document.owner === email);
        if (!isUserOwner && !isUserSigner) {
            res.status(403).json({ err: "You are not authorized to access this document" });
        }
        else {
            signers.forEach((signer, index) => {
                if (signer.email === email) {
                    if (!signer.viewed) {
                        let timeline = document.timeline;
                        timeline.push({ action: 'viewed', time: new Date(), email: getEmail(req, res) });
                        signers[index].viewed = true;
                        document.timeline = timeline;
                    }
                }
            });

            document.signers = signers;
            await document.save();
            res.status(200).json(document);
        }
    }
    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });
    }
}
exports.getComments = async (req, res, next) => {
    try {
        let documentId = req.params.id;
        let document = await Document.findById(documentId, { comments: 1 }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: { email: 1, name: 1, image: 1 }
            }
        }).exec();
         res.status(200).json(document);
    }
    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });
    }
}
exports.postComment = async (req, res, next) => {
    try {
        let documentId = req.params.id;
        let document = await Document.findById(documentId, { comments: 1 });
        let user = await User.findOne({ email: getEmail(req, res) }, { _id: 1 }).exec();
        let comments = document.comments;
        comments = [...comments, { user: user.id, comment: req.body.message }];
         document.comments = comments;
        await document.save();
        res.status(200).json({ message: 'ok' });

    }
    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });
    }
}


exports.addBufferById = async (req, res, next) => {
  try {
    const documentId = req.params.id;
    const newBufferBase64 = req.body.newBuffer;
    let email = getEmail(req, res);

    const document = await Document.findById(documentId).exec();
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    let signers = document.signers;
    for (let i = 0; i < signers.length; i++) {
        let signer = signers[i];
        if (signer.email === email) {
            if (signer.status !== 'signed' && signer.status !== 'rejected' && signer.status !== 'expired') {




    const newBuffer = Buffer.from(newBufferBase64, 'base64');


   // document.buffer = Binary(newBuffer);
    document.lastModifiedHash = sha512(newBuffer);
    let timeline = document.timeline;
    timeline.push({ action: 'signed', time: new Date(), email: getEmail(req, res) });
    signers[i].status = 'signed';
    document.timeline = timeline;
    document.signers = signers;
    signer.documentSigné=Binary(newBuffer);
    console.log(signer.documentSigné)
    await document.save();

    res.status(200).json({ message: 'Buffer added to document successfully' });
            }}}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const zlib = require('zlib');
exports.sigDocument = async (req, res, next) => {
  try {

    const email = getEmail(req, res);
    const documentId = req.params.id;
    let newPdfBufferBase64 = req.body.newPdfBufferBase64;

    const decompressedData = zlib.inflateSync(Buffer.from(newPdfBufferBase64, 'base64'));
    newPdfBufferBase64 = decompressedData.toString('base64');

    const document = await Document.findById(documentId, { signers: 1, timeline: 1 }).exec();

      if (!document) {
          return res.status(404).json({ error: 'Document not found' });
      }

      const signers = document.signers;

      for (let i = 0; i < signers.length; i++) {
          const signer = signers[i];

          if (signer.email === email) {
              if (signer.status !== 'signed' && signer.status !== 'rejected' && signer.status !== 'expired') {
                  const pdfDoc = await PDFDocument.load(newPdfBufferBase64, {
                      updateMetadata: false,
                  });


                  const pdfBytes = await pdfDoc.save();
                  document.documentSigné = Binary(pdfBytes);
                  document.lastModifiedHash = sha512(pdfBytes);

                  const timeline = document.timeline;
                  timeline.push({ action: 'signed', time: new Date(), email: getEmail(req, res) });
                  signers[i].status = 'signed';

                  document.timeline = timeline;
                  document.signers = signers;

                  await document.save();
              }
          }
      }

      res.status(200).json({ message: 'OK' });
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.rejectDocument = async (req, res, next) => {
    try {
        let documentId = req.params.id;
        let document = await Document.findById(documentId, { signers: 1, timeline: 1 }).exec();
        let email = getEmail(req, res);
        let signers = document.signers;
        signers.forEach((signer, index) => {
            if (signer.email === email) {
                if (signer.status !== 'signed' && signer.status !== 'rejected' && signer.status !== 'expired') {
                    let timeline = document.timeline;
                    timeline.push({ action: 'rejected', time: new Date(), email: getEmail(req, res) });
                    signers[index].status = 'rejected';
                    document.timeline = timeline;

                }
            }
        });

        document.signers = signers;

        await document.save();
        res.status(200).json(document);
    }
    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });
    }
}

exports.getStatus = async (req, res, next) => {
    try {
        let documentId = req.params.id;
        let document = await Document.findById(documentId, { status: 1 }).exec();
        if (document) {
            res.status(200).json(document);
        }
        else {
            res.status(200).json({ status: 'not_uploaded' });
        }
    }
    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });

    }
}

exports.verifyDocument = async (req, res, next) => {
    try {

        let document = req.files.doc;
        let documentPath = document.tempFilePath;
        let documentBufferData = fs.readFileSync(documentPath);
        let pdfDoc = await PDFDocument.load((documentBufferData), {
            updateMetadata: false
        });
        let keywords = pdfDoc.getKeywords();
        let pdfBytes = await pdfDoc.save();
        let uploadedDocumentHash = sha512(pdfBytes);

         if (keywords && keywords.length > 0) {
            let id = keywords;
            let doc = await Document.findById(id).exec();
            if (doc) {


                if (doc.lastModifiedHash === uploadedDocumentHash) {
                    res.status(200).json({ verified: true, document: doc });

                }
                else {
                    res.status(200).json({ verified: false });

                }
            }
            else {
                res.status(200).json({ verified: false });

            }
        }
        else {
            res.status(200).json({ verified: false });
        }
    }

    catch (err) {
        res.status(500).json({ err: "Internal Server Error" });

    }
}
