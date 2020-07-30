const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require('bcrypt')
const router = express.Router();
const nodemailer = require("nodemailer");
const UserScema = require("../Schema/UserSchema");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get("/:token", (req, res) => {
  try {
    UserScema.findOne({ passwordResetToken: req.params.token })
      .where("passwordResetExpires")
      .gt(Date.now())
      .exec((err, user) => {
        if (err) {
          return res.send("<H1>INVALID TOKEN</H1>");
        }
        if (!user) {
          return res.send("<H1>INVALID TOKEN</H1>");
        }
      res.send(`
      <!DOCTYPE html>
      <html>      
      <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="theme-color" content="#4DA5F4">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
          
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #17a2b8;
              height: 100vh;
            }
            .spinner-border{
              display:none;
            }
            #login .container #login-row #login-column #login-box {
              margin-top: 120px;
              max-width: 600px;
              height: 320px;
              border: 1px solid #9C9C9C;
              background-color: #EAEAEA;
            }
            #login .container #login-row #login-column #login-box #login-form {
              padding: 20px;
            }
            #login .container #login-row #login-column #login-box #login-form #register-link {
              margin-top: -85px;
            }
          </style>      
          
        
          

      </head>
      
      <body>
      <script type="text/javascript">
      function check(){
        debugger;
        $(".spinner-border").attr('style','display:block');
        if (document.getElementById('password').value ==
          document.getElementById('confirm').value) {
          document.getElementById('message').style.color = 'green';
          document.getElementById('message').innerHTML = 'matching';
          $.post("/reset",
          {
            password: document.getElementById('password').value,
            token: document.getElementById('token').value,
            email: document.getElementById('email').value,
          },
          function(data,status){
            if (confirm(data)) {
              close();          
            }else{
              close();          
            }
            $(".spinner-border").attr('style','display:none')
          });
        } else {
          document.getElementById('message').style.color = 'red';
          document.getElementById('message').innerHTML = 'not matching';
          $(".spinner-border").attr('style','display:none')
        }
      
      }         
      </script>
          <div id="login">
              <h3 class="text-center text-white pt-5">Forgot Your Password</h3>
              <div class="container">
                  <div id="login-row" class="row justify-content-center align-items-center">
                      <div id="login-column" class="col-md-6">
                          <div id="login-box" class="col-md-12">
                          
                               </br>
                               <input type="hidden" name="email" value="${user.email}" id="email">
                               <input type='hidden' value='${req.params.token}' name="token" id="token"/>
                                  <div class="form-group">
                                      <label for="username" class="text-info">New Password:</label><br>
                                      <input  type="password" minlength=5 name="password" id="password"  required  class="form-control">
                                  </div>
                                  <div class="form-group">
                                      <label for="password" class="text-info">Confirm Password:</label><br>
                                      <input  type="password" minlength=5 name="confirm" id="confirm" required  class="form-control">
                                  </div>
                                  <div class="form-group">
                                  <span id='message'></span>
                                     <br>
                                      <input onClick="check();"  type="submit"  class="btn btn-info btn-md"  value="submit"><div class="spinner-border text-primary float-right"></div> 
                                  </div>                                  
                                  
                           
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>      
      `);
      });
  } catch (error) {
    res.send("<H1>INVALID TOCKEN</H1>");
  }
});

router.post("/", urlencodedParser, (req, res) => {
 

  try {
    UserScema.findOne({ passwordResetToken: req.body.token })
      .where("passwordResetExpires")
      .gt(Date.now())
      .exec((err, user) => {       
        if (err) {
          return res.send("LINK EXPIRED").status(401);
        }
        if (!user) {
          return res.send("LINK EXPIRED").status(401);
        }
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            throw err;
          }
          bcrypt.hash(req.body.password, salt, (err, newPassword) => {
            if (err) {
              throw err;
            }
            console.log(newPassword);
            UserScema.updateOne(user, { $set: { password: newPassword,passwordResetToken : "" } }).then(              
              () => {
                    if (error) {                                            
                      return res
                      .send("Faild Try Again");
                    } else {
                      console.log("Send Mail");
                      return res
                        .send("Password Changed Sucessfully");
                    }                  
              }
            ).catch((err)=console.log(err));
          });
        });
      });
  } catch (error) {
    res.send("Faild Try Again");
  }
});

module.exports = router;
