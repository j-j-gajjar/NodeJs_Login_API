const { Mongoose } = require("mongoose")

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    'name':{
        type:String,
        require
    },
    'number':{
        type : String,
        require
    },
    'email':{
        type : String,
        require
    },
    'password':{
        type : String,
        require
    },
    'passwordResetToken':String,
    'passwordResetExpires':Date
})

module.exports = mongoose.model('Users',UserSchema)