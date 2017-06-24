/**
 * Created by diamondrubix on 5/30/17.
 */

app.post('/phone', function (req, res) {
    res.send('POST request to the homepage')
})

//this works but I need to implement sockets
app.post('/answer', function (req, res) {
    res.send('POST request to the homepage')
    console.log(req.body.answer)
})

app.post('/phoneQuery', function (req, res) {
    res.send('POST request to the homepage')
    console.log(req.body)
    /*THIS CODE WORKS, I DIDN'T WANT TO CLUTTER THE DB WITH RANDOM JUNK           <<<<<<<< THIS WORKS
    dbManager.insert('queries',req.body,(err,result)=>{
        console.log('it worked')
    })
    */

})


app.post('/oldphoneLogin', function (req,res) {
    res.send("logged in threw phoneloge in")
});


app.post('/phoneGetAllUserPost', function (req,res) {
    //uid:req.body.key
    console.log('getall user?')
    /*
    dbManager.getOne({uid:req.body.key},"users",function(e,err){
        if(e){
            dbManager.get({},"queries",function(result,error){
                if(error)console.error(error);
                var index =  Math.round(Math.random() * (result.length));
                res.send(result[0])
                //res.send("ta da")
            });
        }else{
            res.send("Bad key")
        }
    })
    */
    res.send('this is where we are')

});


app.post('/phoneGetPost', function (req,res) {
    //uid:req.body.key
    dbManager.getOne({uid:req.body.key},"users",function(e,err){
        if(e){
            dbManager.get({},"queries",function(result,error){
                if(error)console.error(error);
                var index =  Math.round(Math.random() * (result.length));
                res.send(result[index])
                //res.send("ta da")
            });
        }else{
            res.send("Bad key")
        }
    })

});


app.post('/phoneloginvalidate', function (req, res) {
    var logged = false
    dbManager.getOne({username:req.body.username},"users",function(e,err){

        if(e){
            if(sha1(req.body.password)===e.password){
                //delLater = fals
                logged = true
                //res.send("logged in")
                req.session.username=req.body.username;

                db.collection("users").update(
                    {username: req.body.username },
                    {$set: {uid: req.sessionID } }
                );
                res.send(req.sessionID)

            }
        }

        if(!logged){
            var mo = "bad Login"
            res.send(mo)
            //var json = {thing:'one'}
            //res.send(JSON.stringify(json))

        }

        res.end();
    });


});