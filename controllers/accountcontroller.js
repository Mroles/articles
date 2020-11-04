var express=require('express');
const db = require('../models');
const User = db.user;
var bcrypt=require("bcryptjs");
var jwt=require("jsonwebtoken");
var router=express.Router();
//var tempData=require("tempdata");

router.get('/login', (req,res)=>{

    if(req.tempData.get("loginMessage")==""){
        res.render('login.ejs');
    }else{
        console.log("this is tempData"+req.tempData.get("loginMessage"));
      //  var tempVal = JSON.stringify(req.tempData.get('loginMessage'));
       // console.log(tempVal);
        res.render('login.ejs', {layout:false});

    }

});

router.post('/login', (req,res)=>{
    console.log(req.body);
    User.findOne({
        where:{
            username:req.body.username
        }
    }).then(user=>{
        if(!user){
            return res.status(404).send({
                message:"User not found"
            })
        }
        var isValid=bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(isValid){
        req.session.username=user.username;
        req.session.userid=user.id;
        console.log("User: "+user.username);
        console.log("Session: "+ req.session.username);
        return res.redirect("/articles");
        }
        req.tempData.set("sdasd", {x:"sasd"})
        return res.redirect("/login");
    })
});

router.get('/signup',(req,res)=>{
    res.render('signup.ejs')
});


//router.get('/logout', (req,res)=>{
//res.redirect('/login');
//req.session.destroy();
//})

router.post('/logout', (req,res)=>{
    req.session.destroy();
    return res.redirect('/login');
})


module.exports=router;