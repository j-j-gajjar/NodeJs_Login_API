const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router()
const UserScema = require('../Schema/UserSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router.post('/',(req,res)=>{

    const {email,password} = req.body;

    try {
        if( !email || !password)              
            return res.status(401).json({
                "msj" : "all field required"
            })   
        UserScema.findOne({email}).then((user)=>{
            if(!user){
                return res.status(401).json({
                "msj" : "user does not exist"
            })}
            bcrypt.compare(password,user.password)
            .then(  (isTrue)=>{
                if(!isTrue){
                    return res.status(401).json({
                    "msj" : "Invalid Password"
                    })
                }
            jwt.sign(
                {
                    _id:user.id,
                    email
                },
                "abcdefg",
                {expiresIn:3600},
                (err,token)=>{
                    if(err){return res.status(401).json({
                    "msj" : "Try Again"
                    })}
                res.status(200).json({token,user:{email,name:user.name}})
                }
            )
            })
        })
        
    } catch (err) {
      return res.status(401).json({
           "msj" : err
       })
    }

})

module.exports = router