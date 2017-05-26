/**
 * Created by diamondrubix on 5/24/17.
 */


exports.getResult = function (str,callback) {
    //var str = "giber doggo"
    var tags = str.split(" ");
    var result = [];
        //dbManager.get({tags:{"$in":tags}}, "queries", function (doc, err) {
    dbManager.get({$or: [{tags:{"$in":tags}},{title:{"$in":tags}}]}, "queries", function (doc,err) {
        callback(doc);
    });
            //console.log(doc)
            //result.push(doc)

}