const expect = require('expect');
const request = require('supertest');


var {app} = require('./../server.js');
var {Todo} = require('./../models/todo.js');
var {ObjectId} = require('mongodb');
const todos = [{
  _id: new ObjectId(),
  text: 'first test todo'
},{
  _id: new ObjectId(),
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

describe('GET /todos/:id',()=>{
  it('should get todo from given id',(done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it('should return 404 if todo not found',(done)=>{
    request(app)
    .get(`/todo/${new ObjectId().toHexString}`)
    .expect(404)
    .end(done);
  });
  it('should return 404 if invalid ObjectId is provided',(done)=>{
    request(app)
    .get('/todo/123')
    .expect(404)
    .end(done);
  });
});
