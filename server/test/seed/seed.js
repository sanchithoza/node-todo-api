const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
const {Todo}= require('./../../models/todo.js');
const {User} = require('./../../models/user.js');

const userOne = new ObjectId();
const userTwo = new ObjectId();
const todos = [{
  _id: new ObjectId(),
  text: 'first test todo',
  _creator:userOne
},{
  _id: new ObjectId(),
  text: 'second test todo',
  completed:true,
  completedAt:333,
  _creator:userTwo
}];

const users = [{
  _id: userOne,
  email: 'sanchithoza@gmail.com',
  password: '123456789',
  tokens: [{
    access:'auth',
    token: jwt.sign({_id: userOne,access:'auth'},'abc123').toString()
  }]
},{
  _id: userTwo,
  email: 'san@mail.com',
  password: '987654321',
  tokens: [{
    access:'auth',
    token: jwt.sign({_id: userTwo,access:'auth'},'abc123').toString()
  }]
}];


const populateTodos = (done)=>{
  Todo.deleteMany({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done());
};

const populateUsers = (done)=>{
  User.deleteMany({}).then(()=>{
    var one = new User(users[0]).save();
    var two = new User(users[1]).save();
    return Promise.all([one,two]);
  }).then(()=>done());
};
module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
