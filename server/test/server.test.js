const expect = require('expect');
const request = require('supertest');
//const request = require('request');

var {app} = require('./../server.js');
var {Todo} = require('./../models/todo.js');

const todos = [{
  text: 'first test todo'
},{
  text: 'second test todo'
}];

describe('post /todos',()=> {
  beforeEach((done)=>{
    Todo.deleteMany({}).then(()=>{
      Todo.insertMany(todos);
    }).then(()=>done());
  });

  it('should create a new todo',(done)=>{
    var text = 'todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err)=>done("error:"+err));
      });
  });
  it('should not create a to do without text',(done)=>{
    request(app)
    .post('/todos')
    .send()
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((err)=>done(err));
    });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });

});
