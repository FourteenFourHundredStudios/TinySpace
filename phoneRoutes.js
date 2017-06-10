/**
 * Created by diamondrubix on 5/30/17.
 */

app.post('/phone', function (req, res) {
    res.send('POST request to the homepage')
})

app.post('/oldphoneLogin', function (req,res) {

    res.send("logged in threw phoneloge in")

});

app.post('/phoneAll', function (req,res) {
    //uid:req.body.key
    dbManager.getOne({uid:req.body.key},"users",function(e,err){
        if(e){
            dbManager.get({},"queries",function(result,error){
                if(error)console.error(error);
                res.send(result[1])
                console.log(result[1])
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