let createError = require('http-errors');
const axios = require('axios');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const sha512 = require('js-sha512');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
let compression = require('compression');
let fileUpload = require('express-fileupload');
require('./models/mongo');
let document=require('./models/document')
let api = require('./routes/api');
let auth = require('./routes/auth');
let auth_middleware = require('./config/auth');
let app = express();
let bodyParser=require('body-parser')
require('./config/passport');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json())
app.use(compression());
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use(logger('dev'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use('/api', api);
app.use('/auth', auth);

app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send();
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);


