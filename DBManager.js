 db = mongoUtil.getDb();

 exports.append=function(doc,value,cb){
   // MongoClient.connect(url, function(err, db) {
        
        db.collection(doc).insertOne(value,function(er,result){
            cb(er,result);
           // db.close();
        });
        
    //});
}



 exports.getOne=function(search,dbDocument,callback){
    try{
       // MongoClient.connect(url, function(err, db) {
            db.collection(dbDocument).findOne(search,function(err, doc) {
                callback(doc,err);
                //db.close();
            });
        //});
    }catch(err){
        console.error(err);
        callback(undefined,err);
    }
}

 exports.get=function(search,dbDocument,callback){
   // MongoClient.connect(url, function(err, db) {
        db.collection(dbDocument).find(search).toArray(function(err, doc) {
            callback(doc);
        });
}

//db.getCollection('spaces').aggregate([{$match : {catagory:"general"}},{ $sample: { size: 1 } }])


 exports.getRand=function(search,dbDocument,callback){

   // MongoClient.connect(url, function(err, db) {
        
        db.collection(dbDocument).aggregate([{$match : search},{ $sample: { size: 1 } }],function(err, doc){
            
             callback(doc,err);
            // db.close();
        });
   // });

}