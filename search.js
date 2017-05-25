/**
 * Created by diamondrubix on 5/24/17.
 */


exports.getResult = function (str,callback) {
    //var str = "giber doggo"
    var tags = str.split(" ");
    var result = [];
  //  console.log(res)
   // for (var i =0; i<tags.length; i++){
        dbManager.get({tags:{"$in":tags}}, "queries", function (doc, err) {
            //console.log(doc)
            //result.push(doc)
            callback(doc);
        });
  //  }


}