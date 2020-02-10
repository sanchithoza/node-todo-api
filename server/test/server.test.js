const expect = require('expect');
const request = require('supertest');


var {app} = require('./../server.js');
var {Todo} = require('./../models/todo.js');
var {User} = require('./../models/user.js');
var {ObjectId} = require('mongodb');
var {todos,populateTodos,users,populateUsers} = require('./seed/seed.js');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('post /todos',()=> {


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

describe('PATCH /todos/:id',()=>{
  it('should update todo',(done)=>{
    var hexId = todos[1]._id.toHexString();
    var text = 'this shold be new text';
    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.text).toBe(text);
      expect(typeof(res.body.todo.completedAt)).toBe('number');
    })
    .end(done);
  });
  it('should clear completedAt when todo is not completed',(done)=>{
      var hexId = todos[1]._id.toHexString();
      var text = 'this shold be new text';
      request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
    });

  it('should return 404 if todo not found',(done)=>{
    request(app)
    .patch(`/todo/${new ObjectId().toHexString}`)
    .expect(404)
    .end(done);
  });
  it('should return 404 if invalid ObjectId is provided',(done)=>{
    request(app)
    .patch('/todo/123')
    .expect(404)
    .end(done);
  });
});

describe('Get users/me',()=>{
  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  it('should return 401 if not authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users',()=>{
  it('should create user',(done)=>{
    var email = 'example@example.com';
    var password = '123456';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      //console.log(res);
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy();
        expect(user.password).toEqual(expect.not.stringMatching(password));
        done();
      });

    });
  });
  it('should return validation if request invalid',(done)=>{
    var email = 'sanchit@oza.com';
    var password = '1267';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(404)
    .end(done);
  });
  it('should not create user if email in use',(done)=>{
    var email = 'san@mail.com';
    var password = '12345678';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(404)
    .end(done);
  });
});
describe('POST user/login',()=>{
    it('should login and return auth token',(done)=>{
      request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens[0]).toEqual(expect.objectContaining({
            access:'auth',
            token:res.headers['x-auth']
          }));
        done();
      }).catch((e)=>done(e));
    });
  });
    it('should reject invalid login',(done)=>{
      request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:'password'
      })
      .expect(404)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err,res)=>{
        if(err){
          return done(err)
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>done(e));
      });
    });
});
describe('Delete users/me/token',()=>{
  it('should delete token elemnt from user',(done)=>{
    request(app)
    .delete('/users/me/token')
    .set({'x-auth':users[0].tokens[0].token})
    .expect(200)
    .end((err,res)=>{
        if(err){
          done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>done(e));
    });
  });
});
