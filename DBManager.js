 db = mongoUtil.getDb();

 exports.insert=function(doc,value,cb){
     // MongoClient.connect(url, function(err, db) {

     db.collection(doc).insertOne(value, function (er, result) {
         cb(er, result);
         // db.close();
     });

     //});
 };

 exports.getAnswers=function(search,callback){
    try{
       // MongoClient.connect(url, function(err, db) {
        db.collection("answers").aggregate([
    // Unwind the source
     
            {"$match":search},
                { "$lookup": {
                "from": "users",
                "localField": "username",
                "foreignField": "username",
                "as": "userdata",
                    
                }},

   

    {"$project": {"userdata":{"username":0,"password":0,"session":0,"uid":0,"email":0,"status":0} }},
     { "$unwind": "$userdata" },
   // _id : 0,
  //  {"$project": {"userdata":{_id : 0,"score":1}}},
   
   
 //   {"$match":{username:"marc"}},
    
 ],function(err, doc) {
                callback(doc,err);
                //db.close();
            });
        //});
    }catch(err){
        console.error(err);
        callback(undefined,err);
    }
};



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
};


 exports.get=function(search,dbDocument,callback){
   // MongoClient.connect(url, function(err, db) {
        db.collection(dbDocument).find(search).toArray(function(err, doc) {
            callback(doc,err);
        });
};

//db.getCollection('spaces').aggregate([{$match : {catagory:"general"}},{ $sample: { size: 1 } }])


 exports.getRand=function(search,dbDocument,count,callback) {

   // MongoClient.connect(url, function(err, db) {
        
        db.collection(dbDocument).aggregate([{$match : search},{ $sample: { size: count } }],function(err, doc){
            
             callback(doc,err);
            // db.close();
        });
     
};