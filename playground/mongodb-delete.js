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

//  db.collection('Todos').deleteOne({text:'eat lunch'}).then((result)=>{
  //  console.log(result);
  //});

//db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
  //console.log(result);
//});
db.collection('Users').deleteMany({
  name:'sanchit'
}).then((result)=>{
  console.log(result);
});
  client.close();
});
