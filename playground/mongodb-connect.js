const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

//  db.collection('Todos').insertOne({
//    text:'first todo',
//    completed: false
//  },(err,result)=>{
//    if(err){
//        return console.log('unable to insert one',err);
//    }
//    console.log(JSON.stringify(result.ops,undefined,2))
//  });
  db.collection('Users').insertOne({
    name:'sanchit',
    age: 27,
    location: 'navsari'

  },(err,result)=>{
    if(err){
        return console.log('unable to insert one',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
    console.log(result.ops[0]._id.getTimestamp());
  });

  client.close();
});
