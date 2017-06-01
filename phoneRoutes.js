/**
 * Created by diamondrubix on 5/30/17.
 */

app.post('/phone', function (req, res) {
    console.log("aphone did connect")
    res.send('POST request to the homepage')
})

app.post('/oldphoneLogin', function (req,res) {
    console.log(req.body.username)
    console.log(req.body.password)
    res.send("logged in threw phoneloge in")

})


app.post('/', function (req, res) {
    //console.log("HERE");
    dbManager.getOne({username:req.body.username},"users",function(e,err){

        if(e){

            if(sha1(req.body.password)===e.password){

                if(e.status!="active"){
                    res.send("invalid login")
                    res.end();
                    return;
                }

                req.session.username=req.body.username;

                db.collection("users").update(
                    {username: req.body.username },
                    {$set: {uid: req.sessionID } }
                );


            }
        }
        res.writeHead(302, {
            'Location': "/login?invalid=y"
        });
        res.end();
    });


});