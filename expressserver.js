const express = require("express");
const pug = require("pug");
const app = express();
const port = 8080;
const fs = require("fs");
const pages = JSON.parse(fs.readFileSync("pages.json", "utf-8")).pages;

app.set('views', './views');
app.set('view engine', 'pug')

app.use(express.static('static'));

app.get("/", (req, res) => {
    res.render('index', { "pages":pages, activePage:"index" });
});

app.get("/:page", (req, res, next) => {
    var requestPage = false;
    var page;
    for (page of pages) {
        if (page.href == ("/" + req.params.page)) {
            requestPage = page;
        }
    }
    if (requestPage) {
        console.log("serving " + requestPage.href);
        res.render(requestPage.file, { pages:pages, activePage:requestPage.id});
    } else {
        next()
    }
})

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send('something broke!');
})

app.use(function (req, res, next) {
  res.status(404).render("404.pug", { request:req.url, pages:pages, activePage:false });
})

app.listen(port, (err) => {
    if (err) {
        return console.log("Error!", err);
    };
    
    console.log("server is listening on port " + port);
});