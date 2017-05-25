
app.get("/validateaccount",function(req,res){
	dbManager.getOne({status:req.query.c},"users",function(result,err){
		if(result){
			//MongoClient.connect(url, function(err, db) {
				db.collection('users').update(
 					{status:req.query.c},
 					{$set : {"status" : "active"}}
				);

				login(result.username,req,res);
		//	});
		}else{
			redirect("error.html",res);
		}
	});
});


app.get("/signupvalidate",function(req, res){
//	dbSearch({username:params.username,email:params.email},"users",function(result,err){
		code=sha1(Math.random());
		//sucsess
	
			dbManager.append('users',{
				username:xssFilter(req.query.username),
				password:sha1(req.query.password),
				email:xssFilter(req.query.email),
				score:0,
				status:code,
				upVotes:[],
				downVotes:[],
			},function(er, result){
				console.error(er);
				if(er){
					res.writeHead(302, {
						'Location': "/signup?invalid=y"
					});
					res.end();
				}

				transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'tinyspace.co@gmail.com',
						pass: 'Phylum123'
					}
				});

				urls="http://tinyspace.co";
				if(debug){
					urls="http://localhost:8090";
				}

				mailOptions = {
					from: 'TinySpace! 😉 <tinyspace.co@gmail.com>', // sender address
					to: req.query.email, // list of receivers
					subject: 'Activate your TinySpace account!', // Subject line
					text: 'Click here to active your account ', // plain text body
					html: 'Click here to active your account <br><br> <a href="'+urls+'/validateAccount?c='+code+'">here</a>' // html body
				};

				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						res.writeHead(302, {
							'Location': "/SignUp?invalid=n"
						});
						res.end();
						console.log(error);
						return;
					}else{
						res.writeHead(302, {
							'Location': "/val.html"
						});
						res.end();
					}
					//console.log('Message %s sent: %s', info.messageId, info.response);
				});

				
				
			});
		

	
//	});

});

app.get('/loginvalidate', function (req, res) {
	//console.log("HERE");
    dbManager.getOne({username:req.query.username},"users",function(e,err){	
		
		if(e){
			
			if(sha1(req.query.password)===e.password){
				
				if(e.status!="active"){
					res.writeHead(302, {
						'Location': "/login?invalid=i"
					});
					res.end();
					return;
				}
				
				page="/all";
				
				if(req.session.nextPage!=null){
					page=req.session.nextPage;
					req.session.nextPage=null;	
				}

				req.session.username=req.query.username;
                
				db.collection("users").update(
					{username: req.query.username },
					{$set: {uid: req.sessionID } }
				);

                mins=40;
				if(req.query.logged=="true"){
					console.log("checked!");
					var CookieCode=sha1(Math.random()+"TINYTINY");

						db.collection("users").update(
							{username: req.query.username },
							{$set: {session: CookieCode} }
						);	

					res.writeHead(302, {
						'Location': page,
						//'Set-Cookie': 'tinySession='+sessionId+'; expires='+new Date(new Date().getTime()+(mins * 60 * 1000)).toUTCString(),
						'Set-Cookie': 'stayLogged='+CookieCode+'; expires='+new Date(new Date().getTime()+(30*24*60 * 60 * 1000)).toUTCString()
					});
					res.end();
					return;
				}
				res.writeHead(302, {
					'Location': page,
				});
				res.end();
				return;
			}
		}
		res.writeHead(302, {
			'Location': "/login?invalid=y"
		});
		res.end();
	});
     

});

