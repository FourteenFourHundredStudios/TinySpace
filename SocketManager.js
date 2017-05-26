

io.on('connection', function(socket){
	//console.log('a user connected');
	socket.on('disconnect', function(){
		//console.log('user disconnected');
		//db.close();
	});

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

	socket.on('answer', function(msg){
		var postData=null;
		try{
			dbManager.getOne({uid:msg.sid},"users",function(result,error){
				postData={username:result.username,userscore:result.score,content:msg.content};
				dbManager.insert("answers",{
					username:result.username,
					url:msg.url,
					content:msg.content,
					date:new Date()
				},function(){
					socket.emit("postSent",{message:"Question was answered 😎👌"});
					io.to(url).emit('newAnswer', postData);
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
