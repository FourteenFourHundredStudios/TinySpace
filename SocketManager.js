

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

	socket.on('submit', function(msg){
		try{
			console.log("SID: "+msg.tags);
			dbManager.getOne({uid:msg.sid},"users",function(result,error){
				//TODO handle if session id is not tied to username
				dbManager.insert("queries",{
					username:result.username,
					title:msg.title,
					content:msg.content,
					tags:msg.tags.replace(" ,",",").replace(", ",",").replace(",",",").split(","),
					date:new Date(),
					url:sha1(msg.url),
				},function(){
					socket.emit("postSent",{message:"Post was sent! 👌"});
				})
			});
			
		}catch(err){
			socket.emit("postError",{message:err.toString()});
			return;
		}
	});

});
