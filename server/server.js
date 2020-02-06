var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var port = 3000;
var app = express();

app.use(bodyParser.json());

//for adding a todo to mongodb

app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text:req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  });
});

//for adding a user to mongodb

app.post('/users',(req,res)=>{
  var user = new User({
    email:req.body.email
  });
  user.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(400).send(err);
  });
});

//for geting all todos in mongodb

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.status(400).send(err);
  })
});

//for getting a specfic todo by id from mongodb

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send('invalid id');
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  },(e)=>{
    res.status(404).send();
  });

});

app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send('invalid id');
  }

  Todo.findByIdAndDelete(id).then((todo)=>{
    if(!todo){
      return res.status(404).send('todo not exist');
    }
    return res.status(200).send(todo);
  },(err)=>{
    res.status(404).send('invalid req',err);
  });
});



app.listen(port,()=>{
  console.log('started on port :',port);
})
module.exports = {app};
