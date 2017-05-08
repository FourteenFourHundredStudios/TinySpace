

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
		//db.close();
	});
	socket.on('getSpace', function(msg){
		sendPost(socket,msg);
	});
	socket.on('sendSpace', function(msg){
		try{
			//MongoClient.connect(url, function(err, db) {

				dbSearch({name:msg.catagory},"spacelist",function(data){ 
					if(data){	
						db.collection('spaces').insertOne({
							username:getSessionVal("username"),
							rating:0,
							catagory:xssFilter(msg.catagory),
							type:"text",
							title:xssFilter(msg.title),
							content:xssFilter(msg.text)
						});
						socket.emit("postSent","good!");
					}else{
						socket.emit("postError",{errorMessage:"'"+xssFilter(msg.catagory)+"' is not a catagory!"});
						return;
					}
				});
			//});
		}catch(err){
	
			socket.emit("postError",{errorMessage:err.toString()});
			return;
		}
	});

    




	socket.on('sendSpaceImg', function(msg){
		imgName=sha1(Math.random()+Math.random()+"veryverytiny")+".png";
		try{
			//MongoClient.connect(url, function(err, db) {
				dbSearch({name:msg.catagory},"spacelist",function(data){ 
					if(data){	
						//console.log(data.photo);
						fs.writeFile("WebContent/images/"+imgName, msg.photo, function(err) {
							
							if(err){
								console.error(err);
								socket.emit("postError","file could not be saved! ("+err.toString+")");
       							return;
    						}
							
							db.collection('spaces').insertOne({
								username:getSessionVal("username"),
								rating:0,
								catagory:xssFilter(msg.catagory),
								type:"image",
								title:xssFilter(msg.title),
								content:"images/"+imgName,
							});
						
						
							socket.emit("postSent","good!");
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
	//console.log(msg);
	dbManager.getRand({catagory:msg.space},"spaces",function(data,e){
		
		//console.log(data[0]);
		
		if(data[0]!=undefined){
			if(getSessionVal("currentPost")!=undefined){
				//MongoClient.connect(url, function(err, db) {
					if(msg.rate=="good"){	
						db.collection("spaces").update(
							{ _id: getSessionVal("currentPost") },
							{ $inc: {rating: 150} }
						);	
						socket.emit("postRight",data[0]);
					}else if(msg.rate=="bad"){	
						db.collection("spaces").update(
							{ _id: getSessionVal("currentPost") },
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
			addSessionVal("currentPost",data[0]._id);
		}else{
			//console.log("NO DATA");
			socket.emit("postRight",{content:"No more posts are available!",type:"text",title:"Sorry 😭",rating:"???"});
		}
	});
	
}