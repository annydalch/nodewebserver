#!/usr/bin/nodejs

const express = require("express");
const pug = require("pug");
const app = express();
const fs = require("fs");
const twitter = require("./twitterpage.js");
const helmet = require("helmet");
var port;

try {
    port = parseInt(fs.readFileSync("portToUse.txt", "utf8"));
}
catch (err) {
    port = 8080;
    console.log("Failed to read portToUse.txt; defaulted to 8080");
    console.log(err);
}
finally {
    console.log("Selected port " + port);
}

const pages = JSON.parse(fs.readFileSync("pages.json", "utf-8")).pages;

app.use(helmet());

app.set('views', './views');
app.set('view engine', 'pug')

app.use(express.static('static'));

app.get("/", (req, res) => {
    fs.readFile("pages.json", "utf8", (err, pages) => {
        if (err) throw(err);
        res.render('index', {
            pages: JSON.parse(pages).pages,
            activePage: "index"
        });
    })
});

app.get("/twitter", (req, res) => {
    twitter.getTweets((tweets) => {
        fs.readFile("pages.json", "utf8", (err, pages) => {
            if (err) throw(err);
            res.render('twitter.pug', {
                pages: JSON.parse(pages).pages,
                activePage: "twitter",
                tweets: tweets
            });
        })
    })
})

app.get("/twitter/:id", (req, res) => {
    twitter.getTweets((tweets) => {
        res.send(tweets);
    }, req.params.id)
});

app.get("/:page", (req, res, next) => {
    fs.readFile("pages.json", "utf8", (err, pages) => {
        if (err) throw(err);
        pages = JSON.parse(pages).pages;
        var requestPage = false;
        var page;
        for (page of pages) {
            if (page.href == ("/" + req.params.page)) {
                requestPage = page;
            }
        }
        if (requestPage) {
            res.render(requestPage.file, {
                pages: pages,
                activePage: requestPage.id
            });
        }
        else {
            next()
        }
    })
})

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('something broke!');
})

app.use(function(req, res, next) {
    res.status(404).render("404.pug", {
        request: req.url,
        pages: pages,
        activePage: false
    });
})

app.listen(port, (err) => {
    if (err) {
        return console.log("Error!", err);
    };

    console.log("server is listening on port " + port);
});
