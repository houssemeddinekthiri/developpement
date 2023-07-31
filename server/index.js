let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport =require('passport');
let compression = require('compression');
let fileUpload = require('express-fileupload');
require('./models/mongo');
let api = require('./routes/api');
let auth = require('./routes/auth');
let auth_middleware=  require('./config/auth');
let app = express();
require('./config/passport');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(passport.initialize()); 


app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',api);
app.use('/auth',auth);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials",true);
  next();
});



app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send();
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
