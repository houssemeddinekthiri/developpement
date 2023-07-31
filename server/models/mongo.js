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
// const shutdown = function(msg,callback) {
//     mongoose.connection.close(function(){
//         console.log('Mongoose disconnected through '+ msg);
//     });
// };
// process.once('SIGUSR2', function(){
//     shutdown('nodemon restart', function(){
//         process.kill(process.pid,'SIGUSR2');
//     });

// });
// process.on('SIGINT', function(){
//     shutdown('app termination',function(){
//         process.exit(0);
//     });
// });