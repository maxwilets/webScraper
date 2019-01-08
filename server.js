const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("/models");
const PORT = 3000;
const app = express();

// use morgan logger for logging requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
//Make public a static folder
app.use(express.static("public"));

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webScraper", {
    useNewUrlParser: true
});

//Routes

//A GET route for scraping the website
app.get("/scrape", (req, res) => {
    //first grab the body of the HTML with axios
    axios.get("http://www.theberrics.com/").then(response => {
        //Then loaded into cheerio and saved into $ for a shorthand selector
        var $ = cheerio.load(response.data);
        //grap every h3 within the artice
        $("article h2").each(function (i, element) {
            //save an empty result object
            var result = {};
            //add text and href
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            //create a new Article using the 'result' object
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(err => {err})
        });
        //Send a message to the client

    res.send("Scrape Complete")
    });
});

app.get("/articles", function(req,res){
    //Grab every document in the article
    db.Articls.find({})
      .then(function(dbArticle) {
          //if Articles are found send them back to the client
          res.json(dbArticle);
      })
      .catch(err=>{err});
});

//Route for grabbing Article by id, populate by note
app.get("/articles/:id", function(req,res){
    //finding the id with the params
    db.Article.findOne({_id: req.params.id})
      .populate("note")
      .then(function(dbArticle){
          res.json(dbArticle);
      })
      .catch(err=>{err});
});

app.post("/articles/:id", function(req,res){
    //creates a new note 
    db.Note.create(req.body)
      .then(dbNote=>{db.Artible.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id},{new:true})})
        .then(function(dbArtice){
            res.json(dbArticle);
        })
        .catch(err=>{err});
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT+ "!")
})