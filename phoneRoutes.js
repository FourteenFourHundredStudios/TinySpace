/**
 * Created by diamondrubix on 5/30/17.
 */

app.post('/phone', function (req, res) {
    console.log("aphone did connect")
    res.send('POST request to the homepage')
})

app.post('/phoneLogin', function (req,res) {
    console.log(req.body)
    res.send("logged in threw phoneloge in")

})