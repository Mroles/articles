var express = require('express');
const { article } = require('../models');
const db = require("../models");

var router = express.Router();
var articles = db.article;


router.get('/articles', (req, res) => {
    articles.findAll({ include: ["user"] }).then((articles) => {
        console.log(articles);
        let user = req.session.userid || null;
        //var temp=req.tempData.get("loginMessage")||"";
        //console.log("Tempdata got: "+temp)
        res.render("articles.ejs", { articles: articles, user: user })
    });
});

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: articles } = data;
    const currentPage = page ? + page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, articles, totalPages, currentPage };
}




router.get('/pagedarticles', (req, res) => {

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    let user = req.session.userid || null;

    articles.findAndCountAll({ include: ["user"], offset: offset, limit: limit })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.render("articles.ejs", { response: response, user: user });
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

    articles.findByPk(req.params.id, { include: ["user"] }).then(data => {
        res.render("singlearticle.ejs", { data: data, user: user })
    }).catch(err => {
        res.status(500).send({
            message: "Error Occured"
        })
    })
})

module.exports = router