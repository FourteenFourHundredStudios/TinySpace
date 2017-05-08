http = require('http');
util = require('util');
fs = require('fs');
path = require('path');
urlLib = require('url');
sha1 = require('sha1');
express = require('express');
app = express();
ejs = require('ejs');
nodemailer = require('nodemailer');
session = require('express-session');
cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
    secret: "veryverytiny",
    resave: true,
    saveUninitialized: true
}));

mongoUtil = require('./DBConnection');
mongoUtil.connectToServer( function( err ) {     
     userManager=require('./UserManager.js');
     dbManager=require('./DBManager.js');

     console.log("connected to DB!")
});



app.use('/', express.static(path.join(__dirname, 'WebContent/public/')));

app.get('/', function (req, res) {
     console.log(req.cookies); 
     res.render(path.join(__dirname, 'WebContent/hello.ejs'));
});

app.get('/login', function (req, res) {
     res.render(path.join(__dirname, 'WebContent/login.ejs'),{query : req.query});
});

getRandomNum=function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

app.listen(8090, function () {
    console.log('TinySpace listening on port 8090!')
})