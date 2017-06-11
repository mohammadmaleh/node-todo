const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
// to add methods to our model we can do directly so we use schema then add the method then add the whole thing to the model
let UserSchema =  new mongoose.Schema({
        email:{
            type:String,
            unique:true,
            trim:true,
            required:true,
            minlength:1,
            validate:{ // custom validation
                validator:(value)=>{ // return true if valid return false if not
                    return validator.isEmail(value)
                },
                message:'{VALUE} is not a valid email'


            }
        },
        password:{
            type: String,
            required:true,
            minlength:6
        },
        tokens:[{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]
    })
UserSchema.methods.toJSON = function(){ // overwriting an existing function to downsize what are we returning
 let user = this;
 let userObject = this.toObject()
    return _.pick(userObject,['_id','email'])
}
UserSchema.methods.generateAuthToken =function () { // we used old function because arrow function doesn't bind this
    let user = this ;
    let access = 'auth';
    let token = jwt.sign({_id : user._id.toHexString(),access:access},'kappa123').toString();
    user.tokens.push({access:access,token:token})
    return user.save().then(()=>{
        return token
    })
}

UserSchema.statics.findByToken= function (token) {
    let User = this;
    let decoded;
    try{
       decoded= jwt.verify(token,'kappa123')
    } catch (e){
        return new Promise((resolve,reject)=>{ // return a promise that alwais rejects
            reject('')
        })
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token':token,
        'tokens.access':'auth',

    })
};
UserSchema.pre('save',function (next) {
    let user = this ;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err, salt)=>{
            console.log('salt',salt)
            bcrypt.hash(user.password,salt,(err, hash)=>{
                console.log('hash',hash)
                user.password = hash;
                console.log('password',user.password)

                next();
            })
        });
    }
    else{
        next();
    }

})
var User = mongoose.model('User', UserSchema )
module.exports = {User}