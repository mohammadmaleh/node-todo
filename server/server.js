var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb')
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
const  port = process.env.PORT || 3000;

let app =  express();
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text:req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    },(e)=>{
        res.status(400).send(e)
    });
})
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({
            todos,

        })
    },(e)=>{
        res.status(400).send(e)

    })
});
app.get('/todos/:id',(req,res)=>{
    let id = req.params.id
    if (!ObjectID.isValid(id)){
         return res.status(404).send();
    }
    Todo.findById(id)
        .then((todo)=>{
        if(!todo){
             return res.status(404).send()
        }
        res.send( {todo})
        })
        .catch((e)=>{
            res.status(400).send(e)
        })
})



app.listen( port , ()=>{
    console.log(`server is up on ${port}`);
})
module.exports = {app}