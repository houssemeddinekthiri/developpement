const Binary = require('mongodb').Binary;
const User = require('../models/user');
const fs = require('fs');
const Jimp = require("jimp")
const { google } = require('googleapis');
const Document = require('../models/document');
const client = new google.auth.OAuth2(process.env.googleClientId, process.env.googleClientSecret, "http://localhost:3001/auth/google/callback");

function getEmail(req, res) {
    if (!req.cookies.JWT) {
        res.status(401).json({ error: "user not found" });
        return null;
    }
    else {
        let buff = Buffer.from(req.cookies.JWT.split('.')[1], 'base64');
        let text = buff.toString('ascii');
        let email = JSON.parse(text).email;
        return email;
    }
}
exports.getUserNamesList = async(req,res,next)=>{
    try{

        let users =  await User.find({},{email:1,name:1,image:1}).exec();
        console.log(users);
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const convertToPng = async(file)=>{

       let image =  await Jimp.read(file);
       let imageBuffer  = await image.getBufferAsync(Jimp.MIME_PNG);
       return imageBuffer;

}
const unique = (array) =>{
    let set  = new Set();
    let newList = [];
    array.forEach((doc)=>{
        if(!set.has(doc._id)){
           newList.push(doc);
           set.add(doc._id)
        }
    })
    return newList;
}
exports.getFrontPageAnalytics = async (req,res,next)=>{
    let email = getEmail(req);
    console.log(email);
    let documents = await User.findOne({email:email},{sharedDocuments:1,ownedDocuments:1}).populate('ownedDocuments', { buffer: 0 }).populate('sharedDocuments', { buffer: 0 }).exec();
    console.log(documents);
    let MY_DOCUMENTS = documents.ownedDocuments;
    let SHARED_DOCUMENTS = documents.sharedDocuments;
    let WAITING_FOR_OTHERS = 0;
    let FAILED = 0;
    let DRAFTS = 0;
    let COMPLETED = 0;
    let ACTION_REQUIRED = 0;
    let EXPIRING_SOON = 0;
    MY_DOCUMENTS.forEach((document, index1) => {
        if (document.status === 'sent') {

            let rejected = false;
            let waiting = false;
            let expired = false;
            document.signers.forEach((signer, inex2) => {
                if (signer.status === 'rejected' && signer.email!==email)  rejected = true;
                if (signer.status === 'waiting' && signer.email!== email) waiting = true;
                if (Date.now() - new Date(signer.deadline) > 0 && signer.status !== 'signed' && signer.status !== 'rejected' && signer.email!==email) expired = true;

            })
            if (rejected || expired) FAILED++;
            else if (waiting) WAITING_FOR_OTHERS++;
            else COMPLETED++;
        }
        else {
            DRAFTS++;
        }
    })
    SHARED_DOCUMENTS.forEach((document, index1) => {
        let signer = document.signers.filter((signer) =>
            signer.email === email
        )[0];
        if (signer) {

            if (signer.status === 'signed') COMPLETED++;
            else if (signer.status === 'rejected') FAILED++;
            else if (new Date(signer.deadline) - Date.now() < 0) FAILED++;
            else if (new Date(signer.deadline) - Date.now() < 86_400_000) {
                EXPIRING_SOON++;
                ACTION_REQUIRED++;
            }
            else {
                ACTION_REQUIRED++;
            }
        }

    })
    res.status(200).json({action_required:ACTION_REQUIRED,waiting_for_others:WAITING_FOR_OTHERS,expiring_soon:EXPIRING_SOON})

}
exports.analytics = async (req,res,next)=>{
    let email = getEmail(req);
    console.log(email);
    let documents = await User.findOne({email:email},{sharedDocuments:1,ownedDocuments:1}).populate('ownedDocuments', { buffer: 0 }).populate('sharedDocuments', { buffer: 0 }).exec();
    console.log(documents);
    let MY_DOCUMENTS = documents.ownedDocuments;
    let SHARED_DOCUMENTS = documents.sharedDocuments;
    let ALL_DOCUMENTS = unique([...MY_DOCUMENTS,...SHARED_DOCUMENTS])

    let WAITING_FOR_OTHERS = 0;
    let FAILED = 0;
    let DRAFTS = 0;
    let COMPLETED = 0;
    MY_DOCUMENTS.forEach((document, index1) => {
        if (document.status === 'sent') {

            let rejected = false;
            let waiting = false;
            let expired = false;
            document.signers.forEach((signer, inex2) => {
                if (signer.status === 'rejected' ) {
                  rejected = true;rejected = true;

                }
                if (signer.status === 'waiting' && signer.email!== email) waiting = true;
                if (Date.now() - new Date(signer.deadline) > 0 && signer.status !== 'signed' && signer.status !== 'rejected' ) expired = true;

            })
            if (rejected || expired) FAILED++;
            else if (waiting) WAITING_FOR_OTHERS++;
            let notCompleted =0;
           document.signers.forEach((signer,index)=>{
                if(signer.status!=='signed')notCompleted=1;
           })
           if(notCompleted==0)COMPLETED++;
        }
        else {
            DRAFTS++;
        }
    })
    let signed= 0;
    let rejected =0;
    let expired =0;
    SHARED_DOCUMENTS.forEach((document, index1) => {
        let signer = document.signers.filter((signer) =>
            signer.email === email
        )[0];
        if (signer) {

            if (signer.status === 'signed') signed++;
            else if (signer.status === 'rejected') rejected++;
            else if (new Date(signer.deadline) - Date.now() < 0) expired++;

        }

    })
    res.status(200).json({
      signed:signed,rejected:rejected,expired:expired,completed:COMPLETED,failed:FAILED,drafts:DRAFTS,
      my_documents:MY_DOCUMENTS.length,shared_documents:ALL_DOCUMENTS.length - MY_DOCUMENTS.length,all_documents:ALL_DOCUMENTS.length
    })

}

exports.uploadSignature = async(req,res,next)=>{
    try{
        let email = getEmail(req,res);
        console.log(email);
        let user =  await User.findOne({email:email},{signature:1,imageSignature:1}).exec();
        let image = req.files.doc;
        console.log(image);
        let imagePath = image.tempFilePath;

        let imageBuffer  = await convertToPng(imagePath);
        console.log(imageBuffer);

        console.log(req.body.type);
        if(req.body.type==="handwritten"){
           user.signature  = Binary(imageBuffer);
           // console.log(Binary(imageBuffer));

        }
        else{
            user.imageSignature  = Binary(imageBuffer);
        }
        await user.save();
        res.status(200).json({message:'ok'});
    }
    catch(err){
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.getSignatures = async(req,res,next)=>{
    try{
        let email = getEmail(req,res);
        let user =  await User.findOne({email:email},{signature:1,imageSignature:1,defaultSignature:1}).exec();
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.setDefaultSignature  =  async(req,res,next)=>{
    try{
        let email = getEmail(req,res);
        let user =  await User.findOne({email:email},{signature:1,imageSignature:1,defaultSignature:1}).exec();
        user.defaultSignature = req.body.defaultSignature;
        await user.save();
        res.status(200).json({message:'ok'});
    }
    catch(err){
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getAccessToken =  (req,res,next)=>{
    res.status(200).json({accessToken:req.cookies.access_token});
}
exports.storeKeys = async(req,res,next)=>{
   try{
        let email = getEmail(req,res);
        let user =  await User.findOne({email:email},{publicKeys:1,encryptedPrivateKey:1,latestPublicKey:1}).exec();
        let publicKeys = user.publicKeys;
        publicKeys.push(req.body.publicKey);
        console.log(publicKeys);
        user.publicKeys = publicKeys;
        user.latestPublicKey = req.body.publicKey;
        user.encryptedPrivateKey = req.body.encryptedPrivateKey;
        await user.save();
        res.status(200).json({message:'ok'});
   }
   catch(err){
    res.status(500).json({ error: "Internal Server Error" });

   }

}
exports.getKeys = async(req,res,next)=>{
    try{
        let email = getEmail(req,res);
        let user =  await User.findOne({email:email},{latestPublicKey:1,encryptedPrivateKey:1}).exec();
        res.status(200).json({publicKey:user.latestPublicKey,encryptedPrivateKey:user.encryptedPrivateKey});
    }
    catch(err){
    res.status(500).json({ error: "Internal Server Error" });

    }
}
exports.getKeyStatus = async (req,res,next)=>{
    try{
        let email = getEmail(req,res);
        let user =  await User.findOne({email:email},{latestPublicKey:1,publicKeys:1}).exec();
        if(user.publicKeys.length===0){
            res.status(200).json({keyStatus:false})
        }
        else{
            res.status(200).json({keyStatus:true})

        }
    }
    catch(err){
    res.status(500).json({ error: "Internal Server Error" });

    }
}
