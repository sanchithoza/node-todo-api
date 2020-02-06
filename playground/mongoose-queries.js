const {ObjectId} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id ='5e3952c4c6ac951a1cfc729e';

if(!ObjectId.isValid(id)){
  return console.log('invalid id');
}

Todo.find({
  _id: id
}).then((todos)=>{
  if(todos.length < 1){
    return console.log('Id Not Found');
  }
  console.log('todos find',todos);
});

Todo.findOne({
  _id: id
}).then((todos)=>{
  if(!todos){
    return console.log('Id Not Found');
  }
  console.log('todos findone',todos);
});

Todo.findById(id).then((todos)=>{
  if(!todos){
    return console.log('Id Not Found');
  }
  console.log('todos findbyid',todos);
}).catch((err)=>{
  console.log("id is invalid");
});

User.findById(id).then((user)=>{
  if(!user){
    return console.log('id not found');
  }
  console.log('User found by id :',user);
}).catch((err)=>{
  console.log('user id issue',err);
});
