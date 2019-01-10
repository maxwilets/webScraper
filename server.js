const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./modules");
const PORT = 3000;
const app = express();
const exphbs = require("express-handlebars")
// use morgan logger for logging requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
//Make public a static folder
app.use(express.static(__dirname + "/public"));
app.engine(
    "handlebars", 
    exphbs({
    defaultLayout: "main",

}))
app.set("view engine", "handlebars")
//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/webScraper", {
    useNewUrlParser: true
});

//Routes
app.get("/", function(req, res) {
    db.Article.find({"saved":false}, function( err,data) {
      var hbsObject = {
        article: data
      };
      console.log(hbsObject);
      res.render("index", hbsObject);
    });
  });

//A GET route for scraping the website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://stackoverflow.com/questions/tagged/javascript").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $(".summary").each(function(i, element) {
        // Save an empty result object
        var result = {};
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + $(this)+"/n--/n--/n/----n/n---/")
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          
          .children("h3")
          .children("a")
          .text();
        result.link ="https://stackoverflow.com"+ $(this)
          .children("h3")
          .children("a")
          .attr("href");
        result.body = $(this)
          .children(".excerpt")
          .text()
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

app.get("/articles", function(req,res){
    //Grab every document in the article
    db.Article.find({})
      .then(function(dbArticle) {
          //if Articles are found send them back to the client
          res.json(dbArticle);
      })
      .catch(function(err){
          res.json(err)});
});

//Route for grabbing Article by id, populate by note
app.get("/articles/:id", function(req,res){
    //finding the id with the params
    db.Article.findOne({_id: req.params.id})
      .populate("note")
      .then(function(dbArticle){
          res.json(dbArticle);
      })
      .catch(function(err){
          res.json(err)});
});

app.post("/articles/:id", function(req,res){
    //creates a new note 
    db.Note.create(req.body)
      .then(dbNote=>{db.Artible.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id},{new:true})})
        .then(function(dbArtice){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err)});
});

app.post("/articles/save/:id", function(req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
    });
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT+ "!")
})