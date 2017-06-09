const expect = require('expect');
const request = require('supertest')
const {app} = require('./../server')
const {Todo} =require('./../models/todo')
const {ObjectID} =require('mongodb')

const todos = [
    {
        _id:new ObjectID,
        text:'first test todo'
    },
    {
        _id:new ObjectID,

        text:'second test todo'
    }
]
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos).then(()=>{
            done();
        })
    })
})

describe('POST / todos',()=>{
    it('should create new todo',(done)=>{
        let text = 'test todo text'
        request(app)
            .post('/todos')
            .send({
            text:text
            })
            .expect(200)
            .expect((res,req)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err,res)=>{
                if(err){
                    return done(err)
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e)=>{
                    done(e)
                })
            })
    });

    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({
            text:''
        })
        .expect(400)
        .end((err,res)=>{
            if (err){
                return done()
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
                done();
            })
                .catch((e)=>{
                done(e )
                })
        })
    })
});
describe('GET /todos',()=>{
    it('should return all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)

            })
            .end(done)
    })

});
describe('GET /todos/:id',()=>{
    it('should return todo doc',(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('first test todo')
            })
            .end(done)
    })
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    })
    it('should return 404 for non-object id',(done)=>{
        request(app)
            .get(`/todos/123}`)
            .expect(404)
            .end(done)
    })


    });

describe('DELETE /todos/:id',()=>{
    it('should remove a todo',(done)=>{
        var hexID = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexID)
            })
            .end(done)
    })
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    })
    it('should return 404 for non-object id',(done)=>{
        request(app)
            .delete (`/todos/123}`)
            .expect(404)
            .end(done)
    })


});
