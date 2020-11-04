var express=require('express');
const db=require("../models");
var router=express.Router();
var User=db.user;
var bcrypt=require("bcryptjs");

//const { route } = require('./accountcontroller');
require('dotenv').config();

router.get('/admin/users/add',(req,res)=>{
    console.log(process.env.ACCESSTOKEN)
    let user=req.session.userid||0;
  //  if(user){
        res.render("adduser.ejs", {user:user})
   // }
   // else{
     //   res.redirect("/login")
    //}
});

router.post('/admin/users/add', (req,res)=>{
    console.log(req.body);
    console.log(process.env.ACCESSTOKEN);
    let user=req.session.userid||0;

    if(user){
        User.create({
            username:req.body.username,
            password:bcrypt.hashSync(req.body.password,8 ),
            fullname:req.body.fullname,
            email:req.body.email,
            isvisible:true,
            aboutme:req.body.aboutme
        }).then(user=>{
            res.send({
                message:user.username+ " registered successfully"
            });
        }).catch(err=>{
            res.status(500).send({message: err.message})
        })
    }
    else{
       return res.redirect('/login');
    }
})

router.post('/bypass/users/add', (req,res)=>{
    User.create({
        username:req.body.username,
        password:bcrypt.hashSync(req.body.password,8 ),
        fullname:req.body.fullname,
        email:req.body.email,
        isvisible:true,
        aboutme:req.body.aboutme
    }).then(user=>{
        res.send({
            message:user.username+ " registered successfully"
        });
    }).catch(err=>{
        res.status(500).send({message: err.message})
    })
})
    
   


router.get("/admin/users", (req,res)=>{
    let user=req.session.userid;

    if(user){
        User.findAll().then(users=>{
            return res.send(users)
                }).catch(err=>{
                    console.log(err)
                })
    }else{
        return res.redirect("/login");
    }
    
})


module.exports=router