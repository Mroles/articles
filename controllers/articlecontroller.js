var express = require('express');
const { article } = require('../models');
const db = require("../models");
var moment = require('moment');
var router = express.Router();
var articles = db.article;
var comments = db.comment;
const { Op } = require("sequelize");



/*
router.get('/articles', (req, res) => {
    articles.findAll({ include: ["user"] }).then((articles) => {
        console.log(articles);
        let user = req.session.userid || null;
        //var temp=req.tempData.get("loginMessage")||"";
        //console.log("Tempdata got: "+temp)
        res.render("articles.ejs", { articles: articles, user: user })
    });
});
*/

const getPagination = (page, size) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: articles } = data;
    const currentPage = page ? + page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const firstPage = 0;
    return { totalItems, articles, totalPages, currentPage, firstPage };
}




router.get('/articles', (req, res) => {

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    let user = req.session.userid || null;
    var fixedarticles;

    articles.findAll({ include: ["user"], limit: 3 }).then(fixed => {
        fixedarticles = fixed;
        console.log(fixedarticles)
    }).catch((err) => {
        console.log(err);
    });

    articles.findAndCountAll({ include: ["user"], offset: offset, limit: limit })
        .then(data => {
            const response = getPagingData(data, page, limit);
        res.render("articles.ejs", { fixedarticles: fixedarticles, response: response, user: user, moment: moment });
           //res.send({ fixedarticles: fixedarticles, response: response, user: user, moment: moment });

        }).catch((err) => {
            console.log(err);
        });

})

router.get('/articles/add', (req, res) => {
    let user = req.session.userid;
    console.log("Logged In User: " + user)

    if (user) {
        return res.render("createarticle.ejs", { user: user })
    }
    else {
        return res.redirect("/login")
    }
});

router.post("/articles/add", (req, res) => {
    console.log(req.body);
    let user = req.session.userid;
    if (user) {
        articles.create({
            title: req.body.title,
            content: req.body.content,
            imageurl: req.body.url,
            lastedited: Date.now(),
            isvisible: 1,
            excerpt: req.body.excerpt,
            userId: user
        }).then((article) => {
            console.log(article.title + " Created Successfully");
        }).catch((err) => {
            console.log(err);
        });

        //return res.redirect("/articles");
        return res.send("sda")
    }
    else {
        req.tempData.set("loginMessage", { x: "Please Login" });
        return res.redirect("/login");
    }

});

router.get('/articles/:id', (req, res) => {
    let user = req.session.userid;
    var likearticles;

    articles.findAll({
        where: {
            id: {
                [Op.notIn]: [req.params.id]
            },
        },
        limit: 2
    }).then(result => {
        likearticles = result;
        console.log(likearticles)
        //   res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: "Error Occured: " + err
        })
    })

    articles.findByPk(req.params.id, { include: ["user", "comments"] }).then(response => {
        console.log(response);
        var data = {
            response,
            likearticles
        }
       res.render("singlearticle.ejs", { data: data, user: user, moment: moment })
       console.log(data.response.comments);
        // res.send(data);
        //res.send(likearticles);
    }).catch(err => {
        res.status(500).send({
            message: "Error Occured: " + err
        })
    })
});

router.post('/articles/comment/add', (req, res) => {
    console.log("The body I receive is: " + req.body.content);
    console.log(req.body);
     comments.create({
        articleId: parseInt(req.body.articleid), 
        name:req.body.name,
        email:req.body.email,
        content: req.body.content
    }).then(()=>{
        console.log("Successful");
        return res.json({success:true})
    }).catch(err=>{
        return res.json({success:false})
    })
    
})
module.exports = router