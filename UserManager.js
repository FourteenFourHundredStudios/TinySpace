app.get('/loginvalidate', function (req, res) {
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
							{username: params.username },
							{$set: {session: CookieCode} }
						);	

					res.writeHead(302, {
						'Location': "/spaces",
						//'Set-Cookie': 'tinySession='+sessionId+'; expires='+new Date(new Date().getTime()+(mins * 60 * 1000)).toUTCString(),
						'Set-Cookie': 'stayLogged='+CookieCode+'; expires='+new Date(new Date().getTime()+(30*24*60 * 60 * 1000)).toUTCString()
					});
					res.end();
					return;
				}
				res.writeHead(302, {
					'Location': "/spaces",
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