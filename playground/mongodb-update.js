const {MongoClient,ObjectId} = require('mongodb');
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

//  db.collection('Todos').findOneAndUpdate({
//    _id: new ObjectId('5e3869f9bc4d03c2f9b6cb01')
//  },{
//    $set:{
//      completed: true
//    }
//  },{
//    returnOriginal: false
//  }).then((result)=>{
//    console.log(result);
//  });
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectId('5e386c28bc4d03c2f9b6cb56')
  },{
    $set:{
      name:'Sanchit Oza'
    },
    $inc:{
      age:1
    }
  },{
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });
  client.close();
});
