

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		//console.log('user disconnected');
		//db.close();
	});
	socket.on('getSpace', function(msg){
		sendPost(socket,msg);
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

    




	socket.on('sendSpaceImg', function(msg){
		imgName=sha1(Math.random()+Math.random()+"veryverytiny")+".png";
		try{
			//MongoClient.connect(url, function(err, db) {
				dbManager.getOne({name:msg.catagory},"spacelist",function(data){ 
					if(data){	
						//console.log(data.photo);
						fs.writeFile("WebContent/images/"+imgName, msg.photo, function(err) {
							
							if(err){
								console.error(err);
								socket.emit("postError","file could not be saved! ("+err.toString+")");
       							return;
    						}
							
							dbManager.getOne({uid:msg.uid},"users",function(result,error){

								if(result){
									db.collection('spaces').insertOne({
										username:result.username,
										rating:0,
										catagory:xssFilter(msg.catagory),
										type:"image",
										title:xssFilter(msg.title),
										content:"images/"+imgName,
									});
								
							
							
									socket.emit("postSent","good!");
								}else{
									socket.emit("postError",{errorMessage:"Invalid session ID 😉"});
								}
							});
						}); 

					}else{
					//	console.log(xssFilter(msg.catagory));
						socket.emit("postError",{errorMessage:"'"+xssFilter(msg.catagory)+"' is not a catagory!"});
						return;
					}
				
				});
			//});
		}catch(err){
			console.error(err);
			socket.emit("postError",{errorMessage:err.toString()});
			return;
		}
	});	
	
});
 
function sendPost(socket,msg){
	
	dbManager.getRand({catagory:msg.space},"spaces",function(data,e){
		
		//console.log("DATA: "+data);
		
		if(data[0]!=undefined){
            dbManager.getOne({uid:msg.uid},"users",function(result,error){

  

	    		if(result.lastPost!=null){
				//MongoClient.connect(url, function(err, db) {
					if(msg.rate=="good"){	
						db.collection("spaces").update(
							{ _id: result.lastPost },
							{ $inc: {rating: 150} }
						);	
						socket.emit("postRight",data[0]);
					}else if(msg.rate=="bad"){	
						db.collection("spaces").update(
							{ _id: result.lastPost },
							{ $inc: {rating: -150} }
						);	
						socket.emit("postLeft",data[0]);
					}	
			//	});
			}
			
			if(msg.rate=="good"){	
				socket.emit("postRight",data[0]);
			}else if(msg.rate=="bad"){	
				socket.emit("postLeft",data[0]);
			}	
			
            //addSessionVal("currentPost",data[0]._id);
            db.collection("users").update(
				{username: result.username },
				{$set: {lastPost: data[0]._id} }
			);	
        });
		}else{
			//console.log("NO DATA");
			socket.emit("postRight",{content:"No more posts are available!",type:"text",title:"Sorry 😭",rating:"???"});
		}
	});
	
}
