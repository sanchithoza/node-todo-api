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

// db.collection('Todos').find({
//    _id:new ObjectId('5e37efae55bb7401a871f009')
// }).toArray().then((docs,err)=>{
//   console.log('todos');
//   console.log(JSON.stringify(docs,undefined,2));
// },(err)=>{
// console.log(err);
//  });
  db.collection('Users').find({
     name:"sanchit"
  }).toArray().then((docs,err)=>{
    console.log('Users ');
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
  console.log(err);
   });


  //client.close();
});
