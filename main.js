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

debug=true;

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
app.use('/images', express.static(path.join(__dirname, 'WebContent/images/')));

app.get('/', function (req, res) {
     //console.log(req.cookies); 
     res.render(path.join(__dirname, 'WebContent/hello.ejs'));
});

app.get('/login', function (req, res) {
     res.render(path.join(__dirname, 'WebContent/login.ejs'),{query : req.query});
});

app.get('/signup', function (req, res) {
     res.render(path.join(__dirname, 'WebContent/SignUp.ejs'),{query : req.query});
});

app.get('/spaces', function (req, res) {
    dbManager.get({},"spacelist",function(result,error){
        onUserValidated(req,res,function(){
            res.render(path.join(__dirname, 'WebContent/spaces.ejs'),{query : req.query,username:req.session.username,data:result});
        });
    });
});

app.get("/vote", function(req,res){
    onUserValidated(req,res,function(){
        res.render(path.join(__dirname, 'WebContent/vote.ejs'),{query : req.query,uid:req.sessionID});
    });
});

app.get("/post", function(req,res){
    onUserValidated(req,res,function(){
        res.render(path.join(__dirname, 'WebContent/post.ejs'),{query : req.query,uid:req.sessionID});
    });
});

function onUserValidated(req,res,callback){
    if(req.cookies.stayLogged!=undefined && req.session.username==null){
        dbManager.getOne({session:req.cookies.stayLogged},"users",function(result,error){
            
            req.session.username=result.username;
                
            db.collection("users").update(
                {username: result.username },
                {$set: {uid: req.sessionID } }
            );
            redirect(req.originalUrl,res); 
            
        });
    }else{
        if (req.session.username!=null){
            callback();
        }else{
            req.session.nextPage=req.originalUrl;
            redirect("/login?invalid=a",res); 
        }
    }
}

getRandomNum=function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

server.listen(8090,function(){
    console.log('TinySpace listening on port 8090!')
});

xssFilter=function(str){
    fixes=[
        ["<","&lt;"],
        [">","&gt;"],
        ['"',"&#39;"],
        ["'","&#34;"]
    ];

    for(var i=0;i<fixes.length;i++){
        while(str.indexOf(fixes[i][0])!=-1){
            str=str.replace(fixes[i][0],fixes[i][1]);
        }
    }
    
    return str;
}

function redirect(url,res){
	res.writeHead(302, {
		'Location': url
	});
	res.end();
}

function login(usernames,req,res){
	req.session.username=usernames;
                
	db.collection("users").update(
		{username: usernames },
		{$set: {uid: req.sessionID } }
	);

	redirect("/spaces",res);
}

