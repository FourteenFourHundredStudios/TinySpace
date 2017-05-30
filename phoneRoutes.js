/**
 * Created by diamondrubix on 5/29/17.
 */


app.post("/phone", function(req,res){
    console.log("this is a phone connection")
    res.end("hello")
})

app.post("/phoneLogin", function(req,res){
    console.log(req.body)
    //console.log(req.body.username)
    res.end("logged in")
})