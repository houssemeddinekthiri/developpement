var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();

let dbURI = process.env.DB;

mongoose.connect(dbURI,{useNewUrlParser: true,useUnifiedTopology:true});

mongoose.connection.on('connected', function(){
    console.log('mongoose connected');
});

mongoose.connection.on('error',function(err){
    console.log('Mongoose connection error:' + err);
});
