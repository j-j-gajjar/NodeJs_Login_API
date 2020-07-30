const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router()
const UserScema = require('../Schema/UserSchema')

const bcrypt = require('bcrypt')

router.post('/',(req,res)=>{
    
    const {name,email,password,number} = req.body;


    try {
            if(!name || !email || !password || !number)              
                return res.status(401).json({
                    msj : "all field required"
                })   
              
            UserScema.findOne({email}).then((user)=>{
              
                if(user){
                   
                    return res.status(401).json({
                    msj : "user exist"
                })}
                
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err)  {throw (err)}
                  
                    bcrypt.hash(password,salt,(err,newPassword)=>{
                        if(err) {throw (err)}
                       
                        const NewUser = UserScema({
                            name,
                            email,
                            number,
                            password : newPassword
                        })
                    
                        NewUser.save().then(()=>{
                            res.status(200).json({sucess:"ok"})
                        })                           
                    })
                })
            })
        
    } catch (err) {
      return res.status(401).json({
           "msj" : err
       })
    }

})

module.exports = router