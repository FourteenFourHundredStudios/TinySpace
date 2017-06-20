

io.on('connection', function(socket){
	//console.log('a user connected');
	socket.on('disconnect', function(){
		//console.log('user disconnected');
		//db.close();
	});
	function sendNote(username,message){
		io.to("Notes="+username).emit("note","New Message!");
		dbManager.insert("notes",{
			username:username,
			message:message,
			status:"unread",
		},function(result,error){
			
		});
	}

	socket.on('login', function(msg){
		dbManager.getOne({username:msg.username,password:sha1(msg.password)},"users",function(result,err){	
			if(result){
				socket.emit("login",{result:"valid"});
			}else{
				socket.emit("login",{result:"invalid"});
			}
		});
	});

	socket.on('join', function(pathname) {
        socket.join(pathname);
    });

	socket.on('sendBump', function(msg) {	
		dbManager.getOne({uid:msg.sid},"users",function(user,error){
			db.collection("answers").update(
				{username: msg.username, url:msg.url},
				{"$addToSet" : {bumps : user.username}}  
			,function(error,result){
				dbManager.getAnswers({username: msg.username, url:msg.url},function(answers,error3){
					ejs.renderFile(path.join(__dirname, 'WebContent/renderAnswer.ejs'),{data:answers[0],body:false,username:user.username},function(err,html){
						socket.emit("updateAnswer",{html:html,id:msg.id});
						io.to(msg.url).emit("reloadAnswer",{username:msg.username,id:msg.id});
						sendNote(msg.username,user.username+" bumped your <a href='/q/"+msg.url+"'>answer</a>!");
					});
				});
			});
		});
    });

	socket.on('sendUnBump', function(msg) {	
		dbManager.getOne({uid:msg.sid},"users",function(user,error){
			db.collection("answers").update(
				{username: msg.username, url:msg.url},
				{"$pull" : {bumps : user.username}}
			,function(error,result){
				dbManager.getAnswers({username: msg.username, url:msg.url},function(answers,error3){
					ejs.renderFile(path.join(__dirname, 'WebContent/renderAnswer.ejs'),{data:answers[0],body:false,username:user.username},function(err,html){
						//io.to(msg.url) for reaaltime ???
						socket.emit("updateAnswer",{html:html,id:msg.id});
						io.to(msg.url).emit("reloadAnswer",{username:msg.username,id:msg.id});
					});
				});
			});
		});
    });

	socket.on('test', function(msg){
		console.log("test worked "+msg)
	})

	socket.on('answer', function(msg){
		var postData=null;
		try{
			dbManager.getOne({uid:msg.sid},"users",function(result,error){
				dbManager.getOne({url:msg.url,username:result.username},"answers",function(userExists,error){

					if(!userExists){
						postData={username:result.username,userscore:result.score,content:msg.content};
						dbManager.insert("answers",{
							username:result.username,
							url:msg.url,
							content:msg.content,
							bumps:[],
							date:new Date()
						},function(){
							socket.emit("postSent",{message:"Question was answered 😎👌"});
							io.to(url).emit('newAnswer', postData);
							 
							dbManager.getOne({url:msg.url},"queries",function(question,error){
								sendNote(question.username,result.username+" answered your <a href='/q/"+msg.url+"'>question</a>!");
							});

						});
					}else{
						socket.emit("postError",{message:"You've already answerd this question!"});
					}
				});
			});
		}catch(err){
			socket.emit("postError",{message:err.toString()});
			return;
		}
	});

	socket.on('submit', function(msg){
		try{
			//console.log("SID: "+msg.tags);
			url=Math.random().toString(36).substring(15);
			dbManager.getOne({uid:msg.sid},"users",function(result,error){
				//TODO handle if session id is not tied to username
				dbManager.insert("queries",{
					username:result.username,
					title:msg.title,
					content:msg.content,
					tags:msg.tags.replace(" ,",",").replace(", ",",").replace(",",",").split(","),
					date:new Date(),
					url:url,
				},function(){
					socket.emit("postSent",{message:"Post was sent! 👌",url:url});
				});
			});
			
		}catch(err){
			socket.emit("postError",{message:err.toString()});
			return;
		}
	});

});
