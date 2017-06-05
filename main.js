//http = require('http');
/* jshint node: true */

util = require('util');
fs = require('fs');
path = require('path');
urlLib = require('url');
sha1 = require('sha1');
express = require('express');
wildcardSubdomains = require('wildcard-subdomains')
app = express();
server = require('http').Server(app);
io = require('socket.io')(server);

http = require('http');
server = http.createServer(app)
io = require('socket.io').listen(server);

ejs = require('ejs');
nodemailer = require('nodemailer');
session = require('express-session');
cookieParser = require('cookie-parser');

debug=true;
alpha=true;

app.use(wildcardSubdomains({
  namespace: 's', whitelist: ['www', 'app'],
}))

bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/s/*/', function(req, res){

    var domain=req.headers.host.split(":")[0];
    subdomain=domain.substring(0,domain.indexOf("."));
    res.send("subdomain: "+subdomain);
});


/*
var spaceDirector = function(req, res, next) {          
    url=req.originalUrl.substring(1);
    dbManager.getOne({name:url},"spacelist",function(data,error){ 
        if(data){
            onUserValidated(req,res,function(){
                res.render(path.join(__dirname, 'WebContent/vote.ejs'),{query : req.query,uid:req.sessionID,pageName:url});
                res.end();
            });
            
        }
    });
    next(); 
}
app.use(spaceDirector); */


app.use(cookieParser());

/*
  app.use(session({
        secret: "veryverytiny",
        resave: false,
        saveUninitialized: true,
        
        
        storage: 'mongodb',

        host: 'localhost', // optional 
        port: 27017, // optional 
        
    }));
    */

app.use(session({
     secret: 'mysecret',
     resave: false,
     saveUninitialized: false,
     expires: new Date(Date.now() + (60 * 60 * 24 * 7 * 1000)),
     cookie: {  } ,
   //  store: new MongoStore({mongooseConnection: mongoose.connection})
 }));


mongoUtil = require('./DBConnection');
mongoUtil.connectToServer( function( err ) { 
     console.log("connected to DB!");    
     userManager=require('./UserManager.js');
     dbManager=require('./DBManager.js');
     socketManager=require('./SocketManager.js');
     search = require("./search");
     phone = require("./phoneRoutes")


   


     app.get("/q/:space", function(req,res){
        url=req.originalUrl.substring(3);
        onUserValidated(req,res,function(){
           // db.eval("getQuestion('"+url+"')",function(errs,question){
            dbManager.getAnswers({url:url},function(answers,error1){
                dbManager.getOne({url:url},"queries",function(question,error2){
                //console.log(answe)
                    dbManager.getRand({},"queries",5,function(result,error){
                        ejs.renderFile(path.join(__dirname, 'WebContent/query.ejs'),{query:req.query,username:req.session.username,sessionID:req.sessionID,q:question,a:answers,data:result},function(err,result){
                            if(err){
                                console.log(err);
                                return;
                            }
                            res.send(result);
                        }); 
                    });
                });                  
            });
        });
    });

     app.get("/u/:space", function(req,res){
        url=req.originalUrl.substring(3);
        dbManager.get({username:url},"queries",function(queries,error){ 
            dbManager.getAnswers({username:url},function(answers,error){
                content=[]; 
                queries.forEach(function(i){
                    content.push(i);
                });
                answers.forEach(function(i){

                    content.push(i);
                });
                content.sort(function(a,b){
                    return  content.date > content.date; 
                });

                ejs.renderFile(path.join(__dirname, 'WebContent/user.ejs'),{user:url,content:content},function(err,result){
                    if(err)console.log(err);
                    res.send(result);
                });
            });
        });
     });


});


app.use('/', express.static(path.join(__dirname, 'WebContent/public/')));
app.use('/images', express.static(path.join(__dirname, 'WebContent/images/')));

app.get('/', function (req, res) {
     res.render(path.join(__dirname, 'WebContent/index.ejs'));
});


app.get('*.ico', function (req, res) {
    res.send("nah");
    res.end();
});

app.get('/login', function (req, res) {
     res.render(path.join(__dirname, 'WebContent/login.ejs'),{query : req.query});
});

app.get('/profile', function (req, res) {
    onUserValidated(req,res,function(){
        redirect("/u/"+req.session.username,res);
    });
});

app.get('/logout', function (req, res) {
    onUserValidated(req,res,function(){
        un=req.session.username;
        req.session.destroy(function(err) {
            db.collection("users").update(
                { username: un },
                { $unset: { uid: "",session:""} }
            ,function(error,result){
                 redirect("/",res);
            });
        });
    });
});


app.post('/getAnswer', function (req, res) {
    dbManager.getAnswers({url:req.body.url,username:req.body.username},function(answers,error){
        //console.log(answers[0]);
        if(req.body.html=="false"){
            res.send(answers[0]);
        }else{
            ejs.renderFile(path.join(__dirname, 'WebContent/renderAnswer.ejs'),{data:answers[0],body:false,username:req.session.username},function(err,result){
                res.send(result);
            });
        }
    });
});


app.get('/signup', function (req, res) {
    if(alpha){
		dbManager.getOne({code:req.query.c},"codes",function(data,error){ 
			if(data){
				db.collection("codes").deleteMany({code:req.query.c});
				res.render(path.join(__dirname, 'WebContent/SignUp.ejs'),{query : req.query});
			}else{
				redirect("/nocode.html",res);
			}
		});
	}else{
        res.render(path.join(__dirname, 'WebContent/SignUp.ejs'),{query : req.query});
    }
    
});


app.get("/leaderboard", function(req,res){
    dbManager.getRand({},"queries",5,function(result,error){
        //console.log(result);   
        ejs.renderFile(path.join(__dirname, 'WebContent/leaderboard2.ejs'),{query : req.query,sessionID:req.sessionID,data:result},function(err,result){
            if(err)console.error(err);
            
            res.send(result);
        });
    });
});

app.get("/post", function(req,res){
    onUserValidated(req,res,function(){
        ejs.renderFile(path.join(__dirname, 'WebContent/post.ejs'),{query : req.query,sessionID:req.sessionID},function(err,result){
            res.send(result);
        });
    });
});

app.get('/search', function (req, res) {
    search.getResult(req.query.q, function(posts){
        ejs.renderFile(path.join(__dirname, 'WebContent/search.ejs'), {links:posts},function (err,result) {
            res.send(result);
        });
    });
});


app.get("/all", function(req,res){
        dbManager.get({},"queries",function(result,error){
        ejs.renderFile(path.join(__dirname, 'WebContent/all.ejs'),{query : req.query,sessionID:req.sessionID,links:result},function(err,result){
            res.send(result);
        });
    });
});


function onUserValidated(req,res,callback){
    
    if(req.cookies.stayLogged!=undefined && req.session.username==undefined){
        dbManager.getOne({session:req.cookies.stayLogged},"users",function(result,error){
            console.log(req.cookies.stayLogged);
            if(result){
                req.session.username=result.username;                
                db.collection("users").update(
                    {username: result.username },
                    {$set: {uid: req.sessionID } }
                );
                redirect(req.originalUrl,res); 
            }else{
                res.send("Nice try bud 🍪👀😂😏");
                res.end();
            }
        });
    }else{
        if (req.session.username!=undefined){
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

