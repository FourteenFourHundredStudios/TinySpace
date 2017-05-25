/**
 * Created by diamondrubix on 5/24/17.
 */


exports.getResult = function (str) {
    //var str = "giber doggo"
    var res = str.split(" ")
    console.log(res)
    for (var i =0; i<res.length; i++){
        dbManager.get({tags: res[i]}, "queries", function (doc, err) {
            console.log(doc)
        })
    }


}