const express = require('express');
const { Mongoose } = require('mongoose');
const app = express();
const mongoose = require('mongoose')
const login = require("./Router/Login")
const registration = require("./Router/Registration")
const forgotpassword = require("./Router/ForgotPassword")
const reset = require("./Router/ResetPassword")
app.set('view engine', 'jade');
app.set('view engine', 'html');

app.use(express.json());
app.use(express.static('public'));  
mongoose.connect("mongodb://127.0.0.1:27017/apk",{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log("Connected"))
.catch((err)=>console.log(err));

app.use("/api/login",login)
app.use("/api/registration",registration)
app.use("/api/forgotpassword",forgotpassword)
app.use("/reset",reset)


app.use("/",(req,res)=>{res.send("<html><body><h1>HEllo Dev</h1> <label for='favcolor'>Select your favorite color:</label> <input type='color' id='favcolor' name='favcolor' value='#ff0000'><br><br> <input type='submit'><p><b>Note:</b> type='color' is not supported in Internet Explorer 11 or Safari 9.1 (or earlier).</p></body></html>")})

app.listen(4000)