//http = require('http');
util = require('util');
fs = require('fs');
path = require('path');
urlLib = require('url');
sha1 = require('sha1');
express = require('express');

app = express();
server = require('http').Server(app);
io = require('socket.io')(server);

//server.listen(80);

/*

app = express();

server = http.createServer(app);
io = require('socket.io')(server);*/


//app = express()
http = require('http')
server = http.createServer(app)
io = require('socket.io').listen(server);

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
     socketManager=require('./SocketManager.js');
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

app.get('/spaces', function (req, res) {
    dbManager.get({},"spacelist",function(result,error){
        //console.log(req.session.username);
        res.render(path.join(__dirname, 'WebContent/spaces.ejs'),{query : req.query,username:req.session.username,data:result});
    });
});

app.get("/vote", function(req,res){
    res.render(path.join(__dirname, 'WebContent/vote.ejs'),{query : req.query});
});

getRandomNum=function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*
app.listen(8090, function () {
    console.log('TinySpace listening on port 8090!')
})

*/

server.listen(8090,function(){
    console.log('TinySpace listening on port 8090!')
});